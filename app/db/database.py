from sqlalchemy import create_engine, text

DATABASE_URL = "postgresql://neondb_owner:npg_Ur5woqD3FHsg@ep-spring-darkness-a1wuymli-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

engine = create_engine(DATABASE_URL,pool_pre_ping=True,pool_pre_ping=True,     
    pool_recycle=180,      
    pool_size=5,            
    max_overflow=10,        
    connect_args={
        "connect_timeout": 10,
        "sslmode": "require"
    })

def create_table():
    with engine.begin() as conn:
        conn.execute(text("""
        CREATE TABLE IF NOT EXISTS feedback (
            id SERIAL PRIMARY KEY,
            comment TEXT,
            aspect TEXT,
            sentiment TEXT,
            user_rating INTEGER,
            predicted_rating FLOAT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """))