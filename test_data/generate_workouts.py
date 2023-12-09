import asyncio
import random
import uuid
from datetime import datetime, timedelta

import pandas as pd
import psycopg2

# Configurable Parameters
DATA_START_DATE = datetime(2020, 1, 1)
DATA_END_DATE = datetime(2023, 12, 8)

# Database Connection Parameters
DB_HOST = "ep-polished-cherry-55480419-pooler.us-east-1.postgres.vercel-storage.com"
DB_NAME = "verceldb"
DB_USER = "default"
DB_PASSWORD = "Azy2srgWb9aU"


# Establish Database Connection
def get_db_connection():
    return psycopg2.connect(host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD)


def parse_string_to_list(string_value):
    if not string_value:
        return []
    return [int(item) for item in string_value.split(',')]


# Function to read users from CSV
def read_users(file_path):
    users = pd.read_csv(file_path)
    # add uid with uuid4()
    users['uid'] = [str(uuid.uuid4()) for _ in range(len(users))]
    return users


# Function to fetch muscle groups and EIDs from the Exercise table
def get_muscle_groups(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT eid, muscle_group FROM exercise;")
        muscle_groups = {}
        for eid, muscle_group_list in cur.fetchall():
            for muscle_group in muscle_group_list.split(','):
                muscle_groups.setdefault(eid, []).append(muscle_group)
        return muscle_groups


# Function to fetch equipment groups and EIDs from the Exercise table
def get_equipment_types(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT eid, equipment FROM exercise;")
        equipment = {}
        for eid, equipment_list in cur.fetchall():
            for equipment_type in equipment_list.split(','):
                equipment.setdefault(eid, []).append(equipment_type)
        return equipment


# Initialize an empty dictionary to keep track of each user's workout history
workout_history_by_user = {}


# Function to get user's workout history from the generated data
def get_user_history_from_generated_data(uid, eid):
    return workout_history_by_user.get(uid, {}).get(eid, {'weight': 0, 'reps': 0, 'sets': 0})


# Function to get user's workout history
def get_user_history(uid, eid, conn):
    with conn.cursor() as cur:
        cur.execute(
            'SELECT "Weight", "Reps", "Sets" FROM workouts WHERE uid = %s AND eid = %s ORDER BY date DESC LIMIT 1',
            (uid, eid))
        return cur.fetchone() or {'weight': 0, 'reps': 0, 'sets': 0}


# Function to calculate workout progression
def calculate_workout_progression(exercise_details, user_history):
    exercise_type = "compound" if len(exercise_details['muscle_groups']) > 1 else "isolation"
    base_increment = {"compound": 0.10, "isolation": 0.05}
    increment_factor = base_increment[exercise_type]
    if any(muscle in ['Quadriceps', 'Glutes', 'Calves', 'Hamstrings'] for muscle in exercise_details['muscle_groups']):
        increment_factor += 0.02
    new_weight = user_history['weight'] * (1 + increment_factor)
    new_reps = user_history['reps'] + 1 if new_weight > user_history['weight'] else user_history['reps']
    new_sets = user_history['sets']
    return {"weight": new_weight, "reps": new_reps, "sets": new_sets}


# Function to assign initial values to each user
def assign_initial_values(users_df):
    for index, _ in users_df.iterrows():
        users_df.at[index, 'start_date'] = DATA_START_DATE + timedelta(days=random.randint(0, 365 * 2))
        users_df.at[index, 'activity_level'] = random.choice(['low', 'medium', 'high'])
        change_months = sorted(random.sample(range(1, 13), 2))
        change_days = [random.randint(1, 28) for _ in range(2)]

        # Convert lists to string for DataFrame compatibility
        users_df.at[index, 'change_months'] = ','.join(map(str, change_months))
        users_df.at[index, 'change_days'] = ','.join(map(str, change_days))


# Function to update activity level
def update_activity_level(user, current_date):
    for month, day in zip(user['change_months'], user['change_days']):
        if current_date.month == month and current_date.day == day:
            user['activity_level'] = random.choice(['low', 'medium', 'high'])
            break


def get_activity_frequency(activity_level):
    if activity_level == 'low':
        value = 1
    elif activity_level == 'medium':
        value = 3
    elif activity_level == 'high':
        value = 5
    return random.randint(value - 1, value + 2)


equipment_weight_ranges = {
    "Barbell": (45, 500, 5),  # (min weight, max weight, increment)
    "Cables": (0, 300, 5),
    "Cable": (0, 300, 5),
    "Machine": (0, 300, 5),
    "Dumbbell": (5, 100, 5),
    "Kettlebell": (5, 100, 5),
    "Elliptical Machine": (0, 0, 0),  # No weight applicable
    "Smith Machine": (45, 500, 5),
    " Bench": (0, 0, 0),  # No weight applicable
    " Dumbbell": (5, 100, 5),
    "Plates": (2.5, 100, 2.5),
    "Ab Wheel": (0, 0, 0),  # No weight applicable
    "Stability Ball": (0, 0, 0),  # No weight applicable
    " Smith Machine": (45, 500, 5),
    "Battle Ropes": (0, 0, 0),  # No weight applicable
    "Jump Rope": (0, 0, 0),  # No weight applicable
    "Indoor Cycle": (0, 0, 0),  # No weight applicable
    "Pool": (0, 0, 0),  # No weight applicable
    "Track": (0, 0, 0),  # No weight applicable
    "Band": (0, 100, 5),
    " Barbell": (45, 500, 5),
    "Box": (0, 0, 0),  # No weight applicable
    "Captain's Chair": (0, 0, 0),  # No weight applicable
    "Bar": (45, 500, 5),
    "Free Weights Heavy": (45, 300, 5),
    "Resistance Machines and Cables": (10, 300, 5),
    "Medicine Balls": (5, 50, 2.5),
    "No Equipment": (0, 0, 0),  # No weight applicable
    "Bench": (0, 0, 0)
}


def get_starting_weight_and_increment(eid, muscle_group, equipment_type, user_history, muscle_groups):
    # Check if user has a history with this specific exercise
    if eid in user_history:
        return user_history[eid]['weight'], equipment_weight_ranges[equipment_type][2]

    # Check for other exercises with the same muscle group/equipment type
    for other_eid, history in user_history.items():
        if muscle_groups[other_eid] == muscle_group or equipment_type == equipment_type:
            return history['weight'], equipment_weight_ranges[equipment_type][2]

    if "Cardio" in muscle_group:
        return 0, 0

    values = []

    for e_type in equipment_type:
        # return highest values
        values.append((equipment_weight_ranges[e_type][0], equipment_weight_ranges[e_type][2]))

    if values:
        return max(values, key=lambda x: x[0])

    # Default to minimum weight for the equipment type or the first available weight
    return equipment_weight_ranges[equipment_type][0], equipment_weight_ranges[equipment_type][2]


def generate_single_workout(uid, eid, muscle_groups, equipment_types, user_history):
    muscle_group = muscle_groups[eid]
    equipment_type = equipment_types[eid]

    # Starting weight and increment based on equipment type
    starting_weight, increment = get_starting_weight_and_increment(eid, muscle_group, equipment_type, user_history,
                                                                   muscle_groups)

    # Default reps and sets
    default_reps = 8
    default_sets = 3

    # Get the last workout stats for this exercise
    last_workout = user_history.get(eid, {'weight': starting_weight, 'reps': default_reps, 'sets': default_sets})

    # Calculate new weight
    max_weight = max(equipment_weight_ranges[e_type][1] for e_type in equipment_type)
    new_weight = min(last_workout['weight'] + increment, max_weight)

    # Calculate reps and sets
    # If max weight is reached or user is close to it, increase reps and sets instead
    if new_weight >= max_weight * 0.9:  # 90% of max weight as a threshold for plateau
        new_reps = min(last_workout['reps'] + 1, 12)  # Cap at 12 reps
        new_sets = min(last_workout['sets'] + 1, 5)  # Cap at 5 sets
    else:
        new_reps = last_workout['reps']
        new_sets = last_workout['sets']

    # Update user's workout history
    workout_history_by_user.setdefault(uid, {})[eid] = {'weight': new_weight, 'reps': new_reps, 'sets': new_sets}

    return {'eid': eid, 'weight': new_weight, 'reps': new_reps, 'sets': new_sets}


async def generate_activities_and_workouts(users, conn):
    activities_workouts_by_user = {}
    muscle_groups = get_muscle_groups(conn)  # {eid: [muscle_groups]}
    equipment_types = get_equipment_types(conn)  # {eid: equipment_type}
    workout_history_by_user = {}  # To store each user's workout history

    for _, user_row in users.iterrows():
        print(f"Generating data for user: {user_row['name']}")
        uid = user_row['uid']
        # Assign random start date and initial values if not already assigned
        if 'start_date' not in user_row or 'activity_level' not in user_row:
            user_row['start_date'] = DATA_START_DATE + timedelta(days=random.randint(0, 365 * 2))
            user_row['activity_level'] = random.choice(['low', 'medium', 'high'])
            user_row['change_months'] = sorted(random.sample(range(1, 13), 2))
            user_row['change_days'] = [random.randint(1, 28) for _ in range(2)]

        current_date = user_row['start_date']
        activities_workouts_by_user[uid] = []

        while current_date <= DATA_END_DATE:
            update_activity_level(user_row, current_date)
            activity_frequency = get_activity_frequency(user_row['activity_level'])

            for _ in range(activity_frequency):
                # aid = previous_aid + 1
                aid = activities_workouts_by_user[uid][-1]['aid'] + 1 if activities_workouts_by_user[uid] else 1
                # make sure no duplicate days
                activity_date = current_date + timedelta(days=random.randint(0, 6))
                if activity_date in [activity['date'] for activity in activities_workouts_by_user[uid]]:
                    continue
                workouts = []

                for _ in range(random.randint(3, 5)):  # Number of workouts per activity
                    eid = random.choice(list(muscle_groups.keys()))
                    # if no workout history, set to empty dict
                    if uid not in workout_history_by_user:
                        workout_history_by_user[uid] = {}
                    workout = generate_single_workout(uid, eid, muscle_groups, equipment_types,
                                                      workout_history_by_user[uid])
                    workouts.append(workout)

                activities_workouts_by_user[uid].append({'aid': aid, 'date': activity_date, 'workouts': workouts})

            current_date += timedelta(days=7)  # Move to the next week

            current_date += timedelta(days=7)  # Move to the next week

    return activities_workouts_by_user


def calculate_activity_duration(workouts):
    total_sets = sum(workout['sets'] for workout in workouts)
    duration_per_set = 3  # 3 minutes per set

    # Calculate base duration
    base_duration_minutes = total_sets * duration_per_set

    # Apply up to 40% variability (+/-)
    variability = random.uniform(-0.4, 0.4)
    total_duration_minutes = base_duration_minutes * (1 + variability)

    return timedelta(minutes=int(total_duration_minutes))


def write_activities_to_csv(activities_workouts_by_user, filename="activities.csv"):
    activities_data = []

    for uid, activities in activities_workouts_by_user.items():
        for activity in activities:
            # start time = random time between 5:30 am and 11:00 pm
            start_time = activity['date'] + timedelta(hours=random.randint(5, 23), minutes=random.randint(0, 59),
                                                      seconds=random.randint(0, 59))
            duration = calculate_activity_duration(activity['workouts'])
            # make sure start_time + duration < 11:00 pm
            while start_time + duration > activity['date'] + timedelta(hours=23):
                # start time = random time between 5:30 am and 11:00 pm
                start_time = activity['date'] + timedelta(hours=random.randint(5, 23), minutes=random.randint(0, 59),
                                                          seconds=random.randint(0, 59))
            end_time = start_time + duration
            activities_data.append({
                "aid": activity['aid'],
                "uid": uid,
                "date": start_time.date(),
                "start time": start_time.time(),
                "end time": end_time.time(),
                "duration": str(duration),
                "favorite": random.randint(-10, 10)
            })

    activities_df = pd.DataFrame(activities_data)
    activities_df.to_csv(filename, index=False)


def write_workouts_to_csv(activities_workouts_by_user, filename="workouts.csv"):
    workouts_data = []

    for uid, activities in activities_workouts_by_user.items():
        for activity in activities:
            for sequence_num, workout in enumerate(activity['workouts'], start=1):
                workouts_data.append({
                    "aid": activity['aid'],
                    "eid": workout['eid'],
                    "sequence_num": sequence_num,
                    "weight": workout['weight'],
                    "rep": workout['reps'],
                    "set": workout['sets']
                })

    workouts_df = pd.DataFrame(workouts_data)
    workouts_df.to_csv(filename, index=False)


def print_table_names():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = cur.fetchall()
            for table in tables:
                print(table[0])
    except Exception as e:
        print("An error occurred:", e)
    finally:
        conn.close()


def print_table_attributes():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # First, fetch all table names
            cur.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = cur.fetchall()

            for table in tables:
                table_name = table[0]
                print(f"Table: {table_name}")

                # Now, fetch column details for each table
                cur.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = %s
                """, (table_name,))
                columns = cur.fetchall()

                for column in columns:
                    print(f"  Column: {column[0]}, Type: {column[1]}")

    except Exception as e:
        print("An error occurred:", e)
    finally:
        conn.close()


def select_workout_weights():
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute('SELECT "Weight" FROM workouts')
            weights = cur.fetchall()
            for weight in weights:
                print(weight[0])
    except Exception as e:
        print("An error occurred:", e)
    finally:
        conn.close()


# Main execution
async def main():
    print_table_names()
    print_table_attributes()
    print(select_workout_weights())
    conn = get_db_connection()
    try:
        users = read_users("users/users.csv")
        # limit users to size 100
        assign_initial_values(users)
        activities_workouts_by_user = await generate_activities_and_workouts(users, conn)
        # write to activities.csv and workouts.csv
        write_activities_to_csv(activities_workouts_by_user)
        write_workouts_to_csv(activities_workouts_by_user)

    finally:
        conn.close()


if __name__ == "__main__":
    asyncio.run(main())
