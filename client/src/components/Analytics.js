import React, { useMemo } from "react";
import { Progress } from "antd";
const Analytics = ({ allTransection }) => {
  // Dynamically extract income and expense categories from actual transactions
  const incomeCategories = useMemo(() => {
    const categories = new Set();
    allTransection.forEach((transaction) => {
      if (transaction.type === "Income" && transaction.category) {
        categories.add(transaction.category);
      }
    });
    return Array.from(categories).sort();
  }, [allTransection]);

  const expenseCategories = useMemo(() => {
    const categories = new Set();
    allTransection.forEach((transaction) => {
      if (transaction.type === "Expense" && transaction.category) {
        categories.add(transaction.category);
      }
    });
    return Array.from(categories).sort();
  }, [allTransection]);

  // total transaction
  const totalTransaction = allTransection.length;
  const totalIncomeTransactions = allTransection.filter(
    (transaction) => transaction.type === "Income"
  );
  const totalExpenseTransactions = allTransection.filter(
    (transaction) => transaction.type === "Expense"
  );
  const totalIncomePercent =
    (totalIncomeTransactions.length / totalTransaction) * 100;
  const totalExpensePercent =
    (totalExpenseTransactions.length / totalTransaction) * 100;

  //total turnover
  const totalTurnover = allTransection.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalIncomeTurnover = allTransection
    .filter((transaction) => transaction.type === "Income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenseTurnover = allTransection
    .filter((transaction) => transaction.type === "Expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncomeTurnoverPercent =
    (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent =
    (totalExpenseTurnover / totalTurnover) * 100;
  return (
    <>
      <div className="analytics-container">
        <div className="analytics-card-wrapper">
          <div className="card analytics-card" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div className="card-header" style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Total Transactions: {totalTransaction}
            </div>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: '#10b981', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Income: {totalIncomeTransactions.length}
                </h5>
                <h5 style={{ color: '#ef4444', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Expense: {totalExpenseTransactions.length}
                </h5>
              </div>
              <div className="d-flex flex-column align-items-center" style={{ gap: '1rem' }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '0.5rem'
                }}>
                  <Progress
                    type="circle"
                    strokeColor={"#10b981"}
                    percent={totalIncomePercent.toFixed(0)}
                    strokeWidth={8}
                    format={(percent) => `${percent}%`}
                  />
                </div>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '0.5rem'
                }}>
                  <Progress
                    type="circle"
                    strokeColor={"#ef4444"}
                    percent={totalExpensePercent.toFixed(0)}
                    strokeWidth={8}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="analytics-card-wrapper">
          <div className="card analytics-card" style={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            border: 'none'
          }}>
            <div className="card-header" style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}>
              Total Turnover: ₹{totalTurnover.toLocaleString()}
            </div>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h5 style={{ color: '#10b981', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Income: ₹{totalIncomeTurnover.toLocaleString()}
                </h5>
                <h5 style={{ color: '#ef4444', marginBottom: '0.5rem', fontWeight: '600' }}>
                  Expense: ₹{totalExpenseTurnover.toLocaleString()}
                </h5>
                <h5 style={{ 
                  color: totalIncomeTurnover - totalExpenseTurnover >= 0 ? '#10b981' : '#ef4444',
                  marginTop: '1rem',
                  fontWeight: '700',
                  fontSize: '1.2rem'
                }}>
                  Balance: ₹{(totalIncomeTurnover - totalExpenseTurnover).toLocaleString()}
                </h5>
              </div>
              <div style={{ gap: '1rem' }}>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'inline-block',
                  marginRight: '1rem'
                }}>
                  <Progress
                    type="circle"
                    strokeColor={"#10b981"}
                    percent={totalIncomeTurnoverPercent.toFixed(0)}
                    strokeWidth={8}
                    format={(percent) => `${percent}%`}
                  />
                </div>
                <div style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'inline-block'
                }}>
                  <Progress
                    type="circle"
                    strokeColor={"#ef4444"}
                    percent={totalExpenseTurnoverPercent.toFixed(0)}
                    strokeWidth={8}
                    format={(percent) => `${percent}%`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="analytics-card-wrapper">
          <div className="card analytics-card" style={{ border: 'none', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header" style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Categorywise Income
            </div>
            <div className="card-body" style={{ 
              maxHeight: '500px',
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {incomeCategories.filter(category => {
                const amount = allTransection
                  .filter(
                    (transaction) =>
                      transaction.type === "Income" &&
                      transaction.category === category
                  )
                  .reduce((acc, transaction) => acc + transaction.amount, 0);
                return amount > 0;
              }).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  No income transactions found
                </p>
              ) : (
                incomeCategories.map((category, index) => {
                  const amount = allTransection
                    .filter(
                      (transaction) =>
                        transaction.type === "Income" &&
                        transaction.category === category
                    )
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  return (
                    amount > 0 && (
                      <div key={index} className="card mt-2" style={{ 
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-base)'
                      }}>
                        <div className="card-body" style={{ padding: '1rem' }}>
                          <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <h6 style={{ 
                              margin: 0,
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: 'var(--text-primary)'
                            }}>
                              {category.replace('Income in ', '')}
                            </h6>
                            <span style={{ 
                              color: 'var(--secondary-color)',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              ₹{amount.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            percent={totalIncomeTurnover > 0 ? ((amount / totalIncomeTurnover) * 100).toFixed(0) : 0}
                            strokeColor="#10b981"
                            showInfo={true}
                            format={(percent) => `${percent}%`}
                          />
                        </div>
                      </div>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
        <div className="analytics-card-wrapper">
          <div className="card analytics-card" style={{ border: 'none', boxShadow: 'var(--shadow-lg)' }}>
            <div className="card-header" style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Categorywise Expense
            </div>
            <div className="card-body" style={{ 
              maxHeight: '500px',
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {expenseCategories.filter(category => {
                const amount = allTransection
                  .filter(
                    (transaction) =>
                      transaction.type === "Expense" &&
                      transaction.category === category
                  )
                  .reduce((acc, transaction) => acc + transaction.amount, 0);
                return amount > 0;
              }).length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
                  No expense transactions found
                </p>
              ) : (
                expenseCategories.map((category, index) => {
                  const amount = allTransection
                    .filter(
                      (transaction) =>
                        transaction.type === "Expense" &&
                        transaction.category === category
                    )
                    .reduce((acc, transaction) => acc + transaction.amount, 0);
                  return (
                    amount > 0 && (
                      <div key={index} className="card mt-2" style={{ 
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius-md)',
                        transition: 'all var(--transition-base)'
                      }}>
                        <div className="card-body" style={{ padding: '1rem' }}>
                          <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '0.5rem'
                          }}>
                            <h6 style={{ 
                              margin: 0,
                              fontSize: '0.9rem',
                              fontWeight: '600',
                              color: 'var(--text-primary)'
                            }}>
                              {category.replace('Expense in ', '')}
                            </h6>
                            <span style={{ 
                              color: 'var(--danger-color)',
                              fontWeight: '600',
                              fontSize: '0.9rem'
                            }}>
                              ₹{amount.toLocaleString()}
                            </span>
                          </div>
                          <Progress
                            percent={totalExpenseTurnover > 0 ? ((amount / totalExpenseTurnover) * 100).toFixed(0) : 0}
                            strokeColor="#ef4444"
                            showInfo={true}
                            format={(percent) => `${percent}%`}
                          />
                        </div>
                      </div>
                    )
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-3 analytics"></div>
    </>
  );
};

export default Analytics;
