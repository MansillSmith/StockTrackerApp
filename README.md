# StockTrackerApp

I don't quite like all of the other stock trackers out there. So I want to create my own

## Development
### Running
`npx expo start`

On Linux
`CHOKIDAR_USEPOLLING=true npx expo start`

# Notes -> accounting schema chatgpt
-- =========================================
-- DOUBLE ENTRY ACCOUNTING SYSTEM (FULL)
-- =========================================

-- =========================
-- 1. ACCOUNTS (CHART OF ACCOUNTS)
-- =========================
CREATE TABLE accounts (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,
    parent_id   BIGINT NULL REFERENCES accounts(id),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 2. FISCAL PERIODS
-- =========================
CREATE TABLE fiscal_periods (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    is_closed   BOOLEAN DEFAULT FALSE
);

-- =========================
-- 3. JOURNAL ENTRIES (HEADER)
-- =========================
CREATE TABLE journal_entries (
    id              BIGSERIAL PRIMARY KEY,
    entry_date      DATE NOT NULL,
    reference       VARCHAR(100),
    description     TEXT,
    fiscal_period_id BIGINT REFERENCES fiscal_periods(id),
    is_posted       BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- 4. JOURNAL LINES (DOUBLE ENTRY CORE)
-- =========================
CREATE TABLE journal_lines (
    id               BIGSERIAL PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id       BIGINT NOT NULL REFERENCES accounts(id),

    debit            NUMERIC(18,2) DEFAULT 0 CHECK (debit >= 0),
    credit           NUMERIC(18,2) DEFAULT 0 CHECK (credit >= 0),

    description      TEXT
);

-- =========================================
-- OPTIONAL: ENSURE BALANCED JOURNAL ENTRY
-- (PostgreSQL trigger)
-- =========================================

CREATE OR REPLACE FUNCTION check_journal_balance()
RETURNS TRIGGER AS $$
DECLARE
    total_debit NUMERIC;
    total_credit NUMERIC;
    jid BIGINT;
BEGIN
    jid := COALESCE(NEW.journal_entry_id, OLD.journal_entry_id);

    SELECT COALESCE(SUM(debit),0), COALESCE(SUM(credit),0)
    INTO total_debit, total_credit
    FROM journal_lines
    WHERE journal_entry_id = jid;

    IF total_debit <> total_credit THEN
        RAISE EXCEPTION 'Unbalanced journal entry (debits=% credits=%)', total_debit, total_credit;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_journal_balance
AFTER INSERT OR UPDATE OR DELETE ON journal_lines
FOR EACH ROW
EXECUTE FUNCTION check_journal_balance();

-- =========================================
-- SAMPLE DATA
-- =========================================

-- ACCOUNTS
INSERT INTO accounts (code, name, type) VALUES
('1000', 'Cash', 'ASSET'),
('1100', 'Accounts Receivable', 'ASSET'),
('2000', 'Accounts Payable', 'LIABILITY'),
('3000', 'Owner Equity', 'EQUITY'),
('4000', 'Revenue', 'REVENUE'),
('5000', 'Rent Expense', 'EXPENSE');

-- FISCAL PERIOD
INSERT INTO fiscal_periods (name, start_date, end_date, is_closed)
VALUES ('FY2026-Q1', '2026-01-01', '2026-03-31', FALSE);

-- JOURNAL ENTRIES
INSERT INTO journal_entries (entry_date, reference, description, fiscal_period_id)
VALUES
('2026-03-01', 'INV-1001', 'Invoice issued', 1),
('2026-03-02', 'RENT-MAR', 'Paid office rent', 1),
('2026-03-03', 'PAYMENT', 'Customer payment received', 1);

-- JOURNAL LINES

-- Entry 1: Invoice
INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit, description) VALUES
(1, 2, 1000, 0, 'Invoice issued (AR)'),
(1, 5, 0, 1000, 'Revenue earned');

-- Entry 2: Rent
INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES
(2, 6, 500, 0),
(2, 1, 0, 500);

-- Entry 3: Payment
INSERT INTO journal_lines (journal_entry_id, account_id, debit, credit) VALUES
(3, 1, 1000, 0),
(3, 2, 0, 1000);

-- =========================================
-- END OF SCRIPT
-- =========================================


Specifc examples
-- =========================================
-- 1. ACCOUNTS (CASH + EXPENSE + INVESTMENT)
-- =========================================
CREATE TABLE accounts (
    id          BIGSERIAL PRIMARY KEY,
    code        VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    type        VARCHAR(50) NOT NULL,
    currency    VARCHAR(3), -- NULL = multi-currency / investment / control account
    parent_id   BIGINT NULL REFERENCES accounts(id),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 2. SECURITIES (STOCKS)
-- =========================================
CREATE TABLE securities (
    id          BIGSERIAL PRIMARY KEY,
    symbol      VARCHAR(20) UNIQUE NOT NULL,
    name        VARCHAR(255),
    exchange    VARCHAR(50)
);

-- =========================================
-- 3. JOURNAL ENTRIES
-- =========================================
CREATE TABLE journal_entries (
    id              BIGSERIAL PRIMARY KEY,
    entry_date      DATE NOT NULL,
    reference       VARCHAR(100),
    description     TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 4. JOURNAL LINES
-- =========================================
CREATE TABLE journal_lines (
    id               BIGSERIAL PRIMARY KEY,
    journal_entry_id BIGINT NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,

    account_id       BIGINT NOT NULL REFERENCES accounts(id),

    security_id      BIGINT NULL REFERENCES securities(id), -- KEY ADDITION

    debit            NUMERIC(18,6) DEFAULT 0,
    credit           NUMERIC(18,6) DEFAULT 0,

    currency         VARCHAR(3), -- USD, NZD etc
    fx_rate          NUMERIC(18,8) DEFAULT 1,

    quantity         NUMERIC(18,6), -- shares (ONLY used for investment accounts)

    description      TEXT
);

-- =========================================
-- 5. OPTIONAL: BALANCE CHECK (same as before)
-- =========================================
CREATE OR REPLACE FUNCTION check_journal_balance()
RETURNS TRIGGER AS $$
DECLARE
    total_debit NUMERIC;
    total_credit NUMERIC;
    jid BIGINT;
BEGIN
    jid := COALESCE(NEW.journal_entry_id, OLD.journal_entry_id);

    SELECT COALESCE(SUM(debit),0), COALESCE(SUM(credit),0)
    INTO total_debit, total_credit
    FROM journal_lines
    WHERE journal_entry_id = jid;

    IF total_debit <> total_credit THEN
        RAISE EXCEPTION 'Unbalanced entry: debits=% credits=%', total_debit, total_credit;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_balance
AFTER INSERT OR UPDATE OR DELETE ON journal_lines
FOR EACH ROW
EXECUTE FUNCTION check_journal_balance();

INSERT INTO accounts (code, name, type, currency) VALUES
('1000', 'NZ Bank Account', 'ASSET', 'NZD'),
('1010', 'US Broker Cash', 'ASSET', 'USD'),
('1200', 'Stock Portfolio', 'ASSET', NULL),

('4000', 'Dividend Income', 'REVENUE', NULL),
('5000', 'Trading Fees', 'EXPENSE', NULL),
('5010', 'FX Fees', 'EXPENSE', NULL);

INSERT INTO journal_entries (entry_date, reference, description)
VALUES ('2026-03-10', 'BUY-AAPL-1', 'Buy AAPL shares');

-- Debit: Investment (you gain shares)
INSERT INTO journal_lines VALUES
(DEFAULT, 1, 1200, 'AAPL_ID', 1500, 0, 'USD', 1, 10, 'AAPL shares');

-- Debit: Fee expense
INSERT INTO journal_lines VALUES
(DEFAULT, 1, 5000, NULL, 5, 0, 'USD', 1, NULL, 'Broker fee');

-- Credit: Cash reduced
INSERT INTO journal_lines VALUES
(DEFAULT, 1, 1010, NULL, 0, 1505, 'USD', 1, NULL, 'Paid from broker cash');