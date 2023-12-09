import os

import pandas as pd


def concatenate_csv(folder_path, output_file):
    """
    Concatenates all CSV files in the given folder and writes the result to a new CSV file.

    Parameters:
    folder_path (str): The path to the folder containing the CSV files.
    output_file (str): The path to the output CSV file.
    """
    # List to hold dataframes
    dfs = []

    # Iterate over each file in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith('.csv'):
            file_path = os.path.join(folder_path, filename)
            df = pd.read_csv(file_path)
            dfs.append(df)

    # Concatenate all dataframes
    concatenated_df = pd.concat(dfs, ignore_index=True)

    # Write to a new CSV file
    concatenated_df.to_csv(output_file, index=False)


print("Concatenating CSV files...")
folder_path = './users'  # Replace with your folder path
output_file = 'users/users.csv'  # Replace with your desired output file name
concatenate_csv(folder_path, output_file)
