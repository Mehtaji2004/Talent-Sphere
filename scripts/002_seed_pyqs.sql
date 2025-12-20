-- Seed PYQ data for various companies
INSERT INTO pyqs (company, category, question, options, correct_answer, explanation, difficulty, year) VALUES
-- TCS Questions
('TCS', 'Technical', 'What is the time complexity of binary search?', '["O(n)", "O(log n)", "O(n²)", "O(1)"]', 'O(log n)', 'Binary search divides the search space in half with each comparison, resulting in logarithmic time complexity.', 'Medium', 2023),
('TCS', 'Technical', 'Which of the following is not a JavaScript data type?', '["String", "Boolean", "Float", "Object"]', 'Float', 'JavaScript has Number type but not specifically Float. It uses double-precision floating-point format.', 'Easy', 2023),
('TCS', 'Aptitude', 'If a train travels 60 km in 45 minutes, what is its speed in km/hr?', '["75", "80", "85", "90"]', '80', 'Speed = Distance/Time = 60/(45/60) = 60/(3/4) = 80 km/hr', 'Medium', 2023),

-- Google Questions
('Google', 'Technical', 'What is the difference between == and === in JavaScript?', '["No difference", "== checks type, === doesn''t", "=== checks type, == doesn''t", "Both are deprecated"]', '=== checks type, == doesn''t', '== performs type coercion while === checks both value and type without coercion.', 'Medium', 2023),
('Google', 'Technical', 'Which data structure is best for implementing LRU cache?', '["Array", "Linked List", "Hash Map + Doubly Linked List", "Stack"]', 'Hash Map + Doubly Linked List', 'Combination provides O(1) access and O(1) insertion/deletion for LRU operations.', 'Hard', 2023),
('Google', 'System Design', 'How would you design a URL shortener like bit.ly?', '[]', 'Use base62 encoding with database for mapping, implement caching, load balancing, and analytics tracking.', 'Comprehensive system design involving encoding algorithms, database design, caching strategies, and scalability considerations.', 'Hard', 2023),

-- Amazon Questions
('Amazon', 'Technical', 'What is the time complexity of inserting an element in a hash table?', '["O(1) average", "O(n) worst", "Both A and B", "O(log n)"]', 'Both A and B', 'Hash tables have O(1) average case but O(n) worst case due to collisions.', 'Medium', 2023),
('Amazon', 'Behavioral', 'Tell me about a time you had to work with a difficult team member.', '[]', 'Focus on communication, understanding perspectives, finding common ground, and achieving team goals.', 'Use STAR method: Situation, Task, Action, Result. Show leadership and problem-solving skills.', 'Medium', 2023),
('Amazon', 'Technical', 'Implement a function to reverse a linked list.', '[]', 'Iterative: Use three pointers (prev, current, next). Recursive: Reverse rest and adjust pointers.', 'Classic algorithm question testing pointer manipulation and recursion understanding.', 'Medium', 2023),

-- Microsoft Questions
('Microsoft', 'Technical', 'What is the difference between SQL and NoSQL databases?', '[]', 'SQL: Structured, ACID properties, relational. NoSQL: Flexible schema, horizontal scaling, various data models.', 'Understanding of database paradigms, when to use each, and their trade-offs.', 'Medium', 2023),
('Microsoft', 'Technical', 'Explain the concept of closures in JavaScript.', '[]', 'Functions that have access to outer function variables even after outer function returns.', 'Demonstrates understanding of scope, lexical environment, and functional programming concepts.', 'Medium', 2023),

-- Meta Questions
('Meta', 'Technical', 'How would you optimize a React application for performance?', '[]', 'Use React.memo, useMemo, useCallback, code splitting, lazy loading, and proper state management.', 'Comprehensive understanding of React optimization techniques and performance best practices.', 'Hard', 2023),
('Meta', 'System Design', 'Design a news feed system like Facebook.', '[]', 'Fan-out strategies, timeline generation, caching, ranking algorithms, and real-time updates.', 'Complex system design involving data modeling, scalability, and user experience considerations.', 'Hard', 2023);
