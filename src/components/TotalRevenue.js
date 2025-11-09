import React, { useEffect, useMemo, useState } from 'react'
import './TotalRevenue.css'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'

// Sample data (replace with real data when available)
const monthlyEarnings = [
  { month: 'Jan', revenue: 8000 },
  { month: 'Feb', revenue: 12000 },
  { month: 'Mar', revenue: 15000 },
  { month: 'Apr', revenue: 13000 },
  { month: 'May', revenue: 18000 },
  { month: 'Jun', revenue: 21000 },
  { month: 'Jul', revenue: 22000 },
  { month: 'Aug', revenue: 20000 },
  { month: 'Sep', revenue: 19000 },
  { month: 'Oct', revenue: 23000 },
  { month: 'Nov', revenue: 24000 },
  { month: 'Dec', revenue: 25000 },
]

const customerFlow = [
  { month: 'May', customers: 40 },
  { month: 'Jun', customers: 55 },
  { month: 'Jul', customers: 68 },
  { month: 'Aug', customers: 75 },
  { month: 'Sep', customers: 60 },
  { month: 'Oct', customers: 82 },
]

const sampleTransactions = [
  { customer: 'Asha Verma', service: 'Haircut', amount: 450, status: 'Paid', date: '2025-10-28' },
  { customer: 'Ravi Kumar', service: 'Hair Colour', amount: 1200, status: 'Paid', date: '2025-10-27' },
  { customer: 'Neha Singh', service: 'Facial', amount: 800, status: 'Pending', date: '2025-10-26' },
  { customer: 'Priya Das', service: 'Trim', amount: 300, status: 'Paid', date: '2025-10-25' },
  { customer: 'Sourav Roy', service: 'Shave', amount: 250, status: 'Refunded', date: '2025-10-24' },
]

export default function TotalRevenue() {
  const [filter, setFilter] = useState('this_month')
  const [fadeIn, setFadeIn] = useState(false)
  const [chartConfig, setChartConfig] = useState({
    axisFontSize: 12,
    chartHeight: 260,
    leftMargin: 20, // keep small so chart is visually centered
    bottomMargin: 60,
    tickMargin: 12,
    yLabelOffset: 10, // place Y label inside chart so less left margin is needed
    barSize: 28,
  })

  useEffect(() => {
    // page load animation
    const t = setTimeout(() => setFadeIn(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    // responsive chart sizing based on window width
    function update() {
      const w = window.innerWidth
      if (w < 480) {
        setChartConfig({ axisFontSize: 10, chartHeight: 220, leftMargin: 12, bottomMargin: 60, tickMargin: 8, yLabelOffset: 6, barSize: 14 })
      } else if (w < 600) {
        setChartConfig({ axisFontSize: 11, chartHeight: 240, leftMargin: 16, bottomMargin: 64, tickMargin: 10, yLabelOffset: 8, barSize: 18 })
      } else if (w < 900) {
        setChartConfig({ axisFontSize: 12, chartHeight: 260, leftMargin: 20, bottomMargin: 72, tickMargin: 12, yLabelOffset: 10, barSize: 22 })
      } else {
        setChartConfig({ axisFontSize: 13, chartHeight: 300, leftMargin: 28, bottomMargin: 80, tickMargin: 14, yLabelOffset: 12, barSize: 28 })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Filtered chart data (for demo we just slice arrays based on filter)
  const earningsData = useMemo(() => {
    if (filter === 'this_month') return monthlyEarnings.slice(0, 6)
    if (filter === 'this_quarter') return monthlyEarnings.slice(0, 3)
    return monthlyEarnings
  }, [filter])

  // Always show up to the last 6 months in the customer flow chart
  const customersData = useMemo(() => {
    return customerFlow.slice(-6)
  }, [])

  function downloadCSV() {
    const rows = [
      ['Customer', 'Service', 'Amount', 'Payment Status', 'Date'],
      ...sampleTransactions.map((r) => [r.customer, r.service, r.amount, r.status, r.date]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `total-revenue-report-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`tr-page-root ${fadeIn ? 'tr-fade-in' : ''}`}>
      <div className="tr-container">
        {/* Filters & header area */}
        <div className="tr-top">
          <div className="tr-header">
            <h2>Total Revenue Dashboard</h2>
            <div className="tr-actions">
              <select value={filter} onChange={(e) => setFilter(e.target.value)} className="tr-select">
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
                <option value="this_year">This Year</option>
              </select>
              <button className="tr-btn-download" onClick={downloadCSV}>Download Report</button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="tr-cards">
            <div className="tr-card">
              <div className="tr-card-icon money">₹</div>
              <div className="tr-card-body">
                <div className="tr-card-title">Total Revenue</div>
                <div className="tr-card-value">₹1,25,000</div>
              </div>
            </div>
            <div className="tr-card">
              <div className="tr-card-icon calendar">📅</div>
              <div className="tr-card-body">
                <div className="tr-card-title">This Month's Revenue</div>
                <div className="tr-card-value">₹25,000</div>
              </div>
            </div>
            <div className="tr-card">
              <div className="tr-card-icon users">👥</div>
              <div className="tr-card-body">
                <div className="tr-card-title">Total Customers</div>
                <div className="tr-card-value">310</div>
              </div>
            </div>
            <div className="tr-card">
              <div className="tr-card-icon bookings">🧾</div>
              <div className="tr-card-body">
                <div className="tr-card-title">Total Bookings</div>
                <div className="tr-card-value">480</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts area */}
        <div className="tr-charts">
          <div className="tr-chart-card">
            <h3>Monthly Earnings Overview</h3>
            <div className="tr-chart-area" style={{ height: chartConfig.chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData} margin={{ top: 24, right: 24, left: chartConfig.leftMargin, bottom: chartConfig.bottomMargin }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" x2="1">
                      <stop offset="0%" stopColor="#6C63FF" stopOpacity={1} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="rgba(11,26,50,0.06)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                    tickMargin={chartConfig.tickMargin}
                    interval={0}
                    label={{ value: 'Months', position: 'bottom', offset: 18, fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                  />
                  <YAxis
                    tick={{ fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                    tickFormatter={(val) => `₹${Number(val).toLocaleString()}`}
                    label={{ value: 'Revenue (₹)', angle: -90, position: 'insideLeft', offset: chartConfig.yLabelOffset, fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                  />
                  <Tooltip
                    wrapperStyle={{ background: 'rgba(0,0,0,0.75)', borderRadius: 8, padding: '8px 10px' }}
                    formatter={(value, name) => {
                      if (name === 'revenue') return [`₹${Number(value).toLocaleString()}`, 'Revenue']
                      return [value, name]
                    }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="url(#lineGradient)" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="tr-chart-card">
            <h3>Customer Growth (Last 6 Months)</h3>
            <div className="tr-chart-area" style={{ height: chartConfig.chartHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={customersData} margin={{ top: 24, right: 24, left: chartConfig.leftMargin, bottom: chartConfig.bottomMargin }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" x2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6C63FF" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" stroke="rgba(11,26,50,0.04)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                    tickMargin={chartConfig.tickMargin}
                    interval={0}
                    label={{ value: 'Months', position: 'bottom', offset: 18, fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                  />
                  <YAxis
                    tick={{ fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                    label={{ value: 'New Customers', angle: -90, position: 'insideLeft', offset: chartConfig.yLabelOffset, fill: '#0b1a3c', fontSize: chartConfig.axisFontSize }}
                  />
                  <Tooltip
                    wrapperStyle={{ background: 'rgba(0,0,0,0.75)', borderRadius: 8, padding: '8px 10px' }}
                    formatter={(value, name) => [value, name === 'customers' ? 'Customers' : name]}
                  />
                  <Bar dataKey="customers" fill="url(#barGradient)" radius={[8,8,0,0]} barSize={chartConfig.barSize} barCategoryGap={'20%'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Transactions table */}
        <div className="tr-table-card">
          <div className="tr-table-header">
            <h3>Recent Transactions</h3>
            <div className="tr-table-meta">Showing latest {sampleTransactions.length} transactions</div>
          </div>
          <div className="tr-table-wrap">
            <table className="tr-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Amount</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {sampleTransactions.map((tx, idx) => (
                  <tr key={idx}>
                    <td>{tx.customer}</td>
                    <td>{tx.service}</td>
                    <td>₹{tx.amount}</td>
                    <td className={`status ${tx.status.toLowerCase()}`}>{tx.status}</td>
                    <td>{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
