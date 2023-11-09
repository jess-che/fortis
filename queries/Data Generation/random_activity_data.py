import random
import datetime

def random_date(start, end):
    return start + datetime.timedelta(
        seconds=random.randint(0, int((end - start).total_seconds())),
    )

def random_interval():
    minutes = random.randint(10, 59)
    return f"00:{minutes:02d}:00"

start_date = datetime.date(2023, 7, 1)
end_date = datetime.date(2023, 11, 8)

for i in range(1, 100):
    name = f"Workout {i}"
    uid = "4188925c-e00e-43f2-b930-074f83783925"
    date = random_date(start_date, end_date).isoformat()
    interval = random_interval()
    print(f"{name},,{uid},{date},DEFAULT,,{interval}")
