import os

personal_data_file_path = os.path.join("personal", "data.ts")
index_ts_file_path = os.path.join("src", "index.ts")

# lines in "index.ts" that are going to be replaced with "data.ts"
# lines start at 1
replace_lines_start = 3
replace_lines_end = 10

# this lines and the ones after that of "data.ts" will be included in "index.ts"
# meant to skip the import statement to prevent duplicate imports
# lines start at 1
personal_data_file_start_at_line = 3

with open(personal_data_file_path, "r") as f1:
    personal_data_file_lines = f1.readlines()[personal_data_file_start_at_line - 1:]

    with open(index_ts_file_path, "r+") as f2:
        index_ts_file_lines = f2.readlines()

        lines_to_keep_1 = index_ts_file_lines[0:replace_lines_start - 1]
        lines_to_keep_2 = index_ts_file_lines[replace_lines_end:]

        combined = [*lines_to_keep_1, *personal_data_file_lines, *lines_to_keep_2]

        f2.seek(0)
        f2.truncate()
        f2.writelines(combined)