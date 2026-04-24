import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import './App.css'

function App() {
  const [scammers, setScammers] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    fetch('http://localhost:5000/api/scammers')
      .then(response => response.json())
      .then(data => {
        setScammers(data)
        
        // Let's format the data specifically for the chart!
        let cumulative = 0;
        const formattedForChart = data.map(bot => {
          cumulative += 1;
          // Splitting "2026-04-23 19:29:07.054851" into just "19:29:07"
          const timeOnly = bot.time.split(' ')[1].split('.')[0] 
          return { 
            time: timeOnly, 
            TotalBans: cumulative 
          }
        })
        setChartData(formattedForChart)
      })
      .catch(error => console.error("Error fetching data: ", error))
  }, [])

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>System Security Log</h1>
        <p>Monitoring suspicious ticket requests and bot activity.</p>
      </header>

      {/* NEW: The Chart Section! */}
      <div className="chart-wrapper">
        <h2>Cumulative Bots Blocked</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8a6a9b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8a6a9b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="#8c7a9c" fontSize={12} tickMargin={10} />
              <YAxis stroke="#8c7a9c" fontSize={12} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ddf2" vertical={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e8ddf2' }}
                itemStyle={{ color: '#5c4d68', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="TotalBans" stroke="#8a6a9b" strokeWidth={3} fillOpacity={1} fill="url(#colorBans)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="scammer-table">
          <thead>
            <tr>
              <th>Entry ID</th>
              <th>IP Address</th>
              <th>Ban Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {scammers.map((scammer) => (
              <tr key={scammer.id}>
                <td>#{scammer.id}</td>
                <td className="ip-cell">{scammer.ip}</td>
                <td>{scammer.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="dashboard-footer">
        <img 
          src="https://media.giphy.com/media/13CoXDiaCcCoyk/giphy.gif" 
          alt="it woooorks hehehe" 
          className="footer-gif"
        />
        <p>Protected by Jazmin Horton</p>
      </footer>
    </div>
  )
}

export default App