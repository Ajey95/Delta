from sqlalchemy import create_engine

engine = create_engine("postgresql://postgres:vabjr@localhost:5432/Delta")

with engine.connect() as conn:
    result = conn.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    
    for row in result:
        table_name = row[0]  # row is a tuple like ('user_profiles',)
        
        if table_name == 'user_profiles':
            r1 = conn.execute("SELECT  * FROM user_profiles ;")
            for record in r1:
                print(record)


# from sqlalchemy import create_engine

# # Create a connection to the PostgreSQL database
# engine = create_engine("postgresql://postgres:vabjr@localhost:5432/Delta")

# with engine.connect() as conn:
#     # Query to get the table names in the public schema
#     result = conn.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public';")
    
#     for row in result:
#         table_name = row[0]  # row is a tuple like ('user_profiles',)
        
#         # Check if the table is 'notification'
#         if table_name == 'notification':
#             # Query to get the column details from the 'notification' table
#             r1 = conn.execute("""
#                 SELECT column_name, data_type
#                 FROM information_schema.columns
#                 WHERE table_name = 'notification';
#             """)
#             print("Columns in 'notification' table:")
#             for record in r1:
#                 print(f"Column Name: {record['column_name']}, Data Type: {record['data_type']}")
            
#             # Query to get the data where user_id = 1 from the 'notification' table
#             r2 = conn.execute("SELECT * FROM notification WHERE user_id = 1;")
#             print("\nData for id= 1 in 'notification' table:")
#             for record in r2:
#                 print(record)

