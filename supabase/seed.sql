-- ============================================================
-- Streak — Puzzle Seed Data
-- ============================================================
-- 20 curated puzzles with controlled difficulty.
-- Each puzzle has 3 clues that narrow a number between 1 and 50.
--
-- Difficulty levels:
--   easy   — clues narrow to 1-2 candidates
--   medium — clues narrow to 3-5 candidates
--   hard   — clues narrow to 5-8 candidates
--
-- Dates start from 2026-08-15 (launch day).
-- To extend the puzzle bank, simply add more rows.
-- ============================================================

INSERT INTO puzzles (game_date, clue_1, clue_2, clue_3, answer, difficulty) VALUES

-- Week 1: Warm-up (mostly easy/medium)
('2026-08-15', 'I''m an even number', 'I''m divisible by 3', 'I''m greater than 20', 24, 'medium'),
('2026-08-16', 'I''m a prime number', 'I''m between 10 and 20', 'My digits add up to 4', 13, 'easy'),
('2026-08-17', 'I''m an odd number', 'I''m a perfect square', 'I''m less than 30', 25, 'easy'),
('2026-08-18', 'I''m divisible by 5', 'I''m greater than 30', 'I''m even', 40, 'medium'),
('2026-08-19', 'I''m a prime number', 'I''m less than 10', 'I''m greater than 5', 7, 'easy'),
('2026-08-20', 'I''m divisible by 4', 'I''m between 25 and 45', 'My digits add up to 9', 36, 'medium'),
('2026-08-21', 'I''m an odd number', 'I''m divisible by 7', 'I''m less than 25', 21, 'easy'),

-- Week 2: Medium difficulty
('2026-08-22', 'I''m an even number', 'I''m a perfect square', 'I''m greater than 10', 16, 'medium'),
('2026-08-23', 'I''m divisible by 3', 'I''m less than 20', 'I''m greater than 10', 15, 'medium'),
('2026-08-24', 'I''m a prime number', 'I''m greater than 20', 'I''m less than 35', 29, 'medium'),
('2026-08-25', 'I''m divisible by 6', 'I''m less than 50', 'My digits add up to 6', 42, 'medium'),
('2026-08-26', 'I''m an odd number', 'I''m between 30 and 50', 'I''m divisible by 3', 33, 'medium'),
('2026-08-27', 'I''m an even number', 'I''m less than 15', 'I''m greater than 5', 8, 'medium'),
('2026-08-28', 'I''m divisible by 5', 'I''m odd', 'I''m between 20 and 50', 25, 'easy'),

-- Week 3: Harder puzzles
('2026-08-29', 'I''m a prime number', 'I''m greater than 35', 'I''m less than 50', 37, 'hard'),
('2026-08-30', 'My digits multiply to give 8', 'I''m greater than 20', 'I''m an even number', 42, 'hard'),
('2026-08-31', 'I''m divisible by 4', 'I''m less than 30', 'My digits add up to 3', 12, 'medium'),
('2026-09-01', 'I''m an odd number', 'I''m a two-digit number', 'Both my digits are the same', 11, 'easy'),
('2026-09-02', 'I''m divisible by 7', 'I''m greater than 30', 'I''m less than 50', 49, 'hard'),
('2026-09-03', 'I''m a prime number', 'I''m between 40 and 50', 'I''m odd', 43, 'hard')

ON CONFLICT (game_date) DO NOTHING;
