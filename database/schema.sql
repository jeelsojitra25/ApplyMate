CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()

);
CREATE TABLE applications(
    id SERIAL PRIMARY KEY,
    user_id INT REFRENCES users(id) ON DELETE CASCADE,
    compan VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'applied'
    applied_date DATE NOT NULL,
    follow_up_date DATE,
    job_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
