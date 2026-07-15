import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../axiosinstance';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChartLine, faSpinner, faSearch, faSignOutAlt,
    faTachometerAlt, faHistory, faCog,
    faExclamationTriangle, faCheckCircle, faArrowRight,
    faTrash, faCalendarAlt, faClock, faRedo
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

/* ──────────────────────────────────────────
   Sub-components
────────────────────────────────────────── */

const MetricCard = ({ label, value, iconClass, accent }) => (
    <div className={`metric-card accent-${accent}`}>
        <div className="d-flex align-items-center justify-content-between">
            <div>
                <div className="metric-label">{label}</div>
                <div className="metric-value">
                    {value !== null
                        ? Number(value).toExponential(3)
                        : <span style={{ fontSize: '1rem', color: '#484f58' }}>—</span>}
                </div>
            </div>
            <div className={`metric-icon ${iconClass}`}>
                <FontAwesomeIcon icon={faChartLine} />
            </div>
        </div>
    </div>
);

const ChartPanel = ({ title, badge, badgeClass, src, alt }) => (
    <div className="chart-panel">
        <div className="chart-panel-header">
            <span className="chart-panel-title">{title}</span>
            <span className={`chart-panel-badge badge ${badgeClass}`}>{badge}</span>
        </div>
        <div className="chart-panel-body">
            {src ? (
                <img src={src} alt={alt} />
            ) : (
                <div className="d-flex align-items-center justify-content-center flex-column"
                    style={{ height: '220px', color: '#484f58' }}>
                    <FontAwesomeIcon icon={faChartLine}
                        style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.25 }} />
                    <p style={{ fontSize: '0.8rem', margin: 0 }}>Run a prediction to see this chart</p>
                </div>
            )}
        </div>
    </div>
);

/* R² quality badge helper */
const R2Badge = ({ value }) => {
    if (value === null) return <span style={{ color: '#484f58' }}>—</span>;
    const v = Number(value);
    if (v >= 0.9) return <span className="badge bg-success bg-opacity-25 text-success">{v.toFixed(4)}</span>;
    if (v >= 0.75) return <span className="badge bg-primary bg-opacity-25 text-primary">{v.toFixed(4)}</span>;
    if (v >= 0.5) return <span className="badge bg-warning bg-opacity-25 text-warning">{v.toFixed(4)}</span>;
    return <span className="badge bg-danger bg-opacity-25 text-danger">{v.toFixed(4)}</span>;
};

/* ──────────────────────────────────────────
   Main Dashboard Component
────────────────────────────────────────── */

const Dashboard = () => {
    // ── View state
    const [view, setView] = useState('prediction'); // 'prediction' | 'history'

    // ── Prediction state
    const [ticker, setTicker] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [predictionDone, setPredictionDone] = useState(false);
    const [plot, setPlot] = useState(null);
    const [ma100plot, setMA100Plot] = useState(null);
    const [ma200plot, setMA200Plot] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [mse, setMSE] = useState(null);
    const [rmse, setRMSE] = useState(null);
    const [r2, setR2] = useState(null);

    // ── History state
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);
    const [clearingHistory, setClearingHistory] = useState(false);

    const navigate = useNavigate();
    const username = localStorage.getItem('username') || 'User';
    const avatarLetter = username.charAt(0).toUpperCase();

    /* ── Auth verify on mount */
    useEffect(() => {
        const verifyAuth = async () => {
            try { await axiosInstance.get('protected_view/'); }
            catch (err) { console.error('Auth verification failed:', err); }
        };
        verifyAuth();
    }, []);

    /* ── Fetch history */
    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError(null);
        try {
            const res = await axiosInstance.get('history/');
            setHistory(res.data);
        } catch (err) {
            setHistoryError(err.response?.data?.detail || 'Failed to load history.');
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    /* Load history when switching to that view */
    useEffect(() => {
        if (view === 'history') fetchHistory();
    }, [view, fetchHistory]);

    /* ── Logout */
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    /* ── Run prediction */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPredictionDone(false);
        try {
            const response = await axiosInstance.post('predict/', { ticker });
            if (response.data.error) { setError(response.data.error); return; }

            const backendRoot = import.meta.env.VITE_BACKEND_ROOT;
            setPlot(`${backendRoot}${response.data.plot_img}`);
            setMA100Plot(`${backendRoot}${response.data.plot_img_100dma}`);
            setMA200Plot(`${backendRoot}${response.data.plot_img_200dma}`);
            setPrediction(`${backendRoot}${response.data.plot_prediction}`);
            setMSE(response.data.mse);
            setRMSE(response.data.rmse);
            setR2(response.data.r2);
            setPredictionDone(true);
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /* ── Re-run from history */
    const handleRerun = (tickerSymbol) => {
        setTicker(tickerSymbol);
        setView('prediction');
    };

    /* ── Clear all history */
    const handleClearHistory = async () => {
        if (!window.confirm('Delete your entire prediction history? This cannot be undone.')) return;
        setClearingHistory(true);
        try {
            await axiosInstance.delete('history/');
            setHistory([]);
        } catch (err) {
            setHistoryError('Failed to clear history.');
        } finally {
            setClearingHistory(false);
        }
    };

    /* ── Format date */
    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };
    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    /* ══════════════════════════════════════
       RENDER
    ══════════════════════════════════════ */
    return (
        <div className="dashboard-root">

            {/* ═══════════ SIDEBAR ═══════════ */}
            <aside className="dashboard-sidebar">
                <div className="sidebar-brand d-flex align-items-center gap-2">
                    <div className="sidebar-brand-icon">📈</div>
                    <div>
                        <div className="sidebar-brand-text">StockVision</div>
                        <div className="sidebar-brand-sub">AI Predictions Portal</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-nav-section">Main</div>

                    <button
                        className={`sidebar-nav-item ${view === 'prediction' ? 'active' : ''}`}
                        onClick={() => setView('prediction')}
                    >
                        <FontAwesomeIcon icon={faTachometerAlt} style={{ width: 16 }} />
                        Dashboard
                    </button>

                    <button
                        className={`sidebar-nav-item ${view === 'history' ? 'active' : ''}`}
                        onClick={() => setView('history')}
                    >
                        <FontAwesomeIcon icon={faHistory} style={{ width: 16 }} />
                        History
                        {history.length > 0 && (
                            <span className="badge ms-auto"
                                style={{ background: 'rgba(56,139,253,0.2)', color: '#388bfd', fontSize: '0.65rem' }}>
                                {history.length}
                            </span>
                        )}
                    </button>

                    <div className="sidebar-nav-section" style={{ marginTop: '0.5rem' }}>Settings</div>
                    <a className="sidebar-nav-item">
                        <FontAwesomeIcon icon={faCog} style={{ width: 16 }} />
                        Preferences
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <div className="d-flex align-items-center gap-2 mb-2">
                        <div className="sidebar-avatar">{avatarLetter}</div>
                        <div>
                            <div className="sidebar-user-info text-capitalize">{username}</div>
                            <div className="sidebar-user-role">Free Plan</div>
                        </div>
                    </div>
                    <button className="btn-logout-sidebar" onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ═══════════ MAIN ═══════════ */}
            <main className="dashboard-main">

                {/* Top bar */}
                <div className="dashboard-topbar d-flex align-items-center justify-content-between">
                    <div>
                        <div className="page-title">
                            {view === 'prediction' ? 'Stock Prediction' : 'Prediction History'}
                        </div>
                        <div className="page-subtitle">
                            {view === 'prediction'
                                ? 'Powered by LSTM Neural Network'
                                : `${history.length} prediction${history.length !== 1 ? 's' : ''} recorded`}
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <span className="status-dot online"></span>
                        <span style={{ fontSize: '0.75rem', color: '#8b949e' }}>Model Ready</span>
                    </div>
                </div>

                <div className="dashboard-content">

                    {/* ════════════════════════════════
                        VIEW: PREDICTION
                    ════════════════════════════════ */}
                    {view === 'prediction' && (
                        <>
                            {/* Search card */}
                            <div className="ticker-search-card mb-4">
                                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e6edf3', marginBottom: '0.25rem' }}>
                                    Enter a Stock Ticker
                                </p>
                                <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '1.25rem' }}>
                                    Supports NYSE &amp; NASDAQ — e.g. AAPL, TSLA, GOOGL, INFY.NS
                                </p>
                                <form onSubmit={handleSubmit}>
                                    <div className="d-flex gap-3 flex-wrap">
                                        <div className="ticker-input-wrapper flex-grow-1">
                                            <FontAwesomeIcon icon={faSearch} className="ticker-input-icon" />
                                            <input
                                                type="text"
                                                className="ticker-input form-control"
                                                value={ticker}
                                                placeholder="e.g. AAPL, TSLA, INFY.NS"
                                                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <button type="submit" className="btn-predict" disabled={loading}>
                                            {loading ? (
                                                <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Predicting...</>
                                            ) : (
                                                <>Run Prediction <FontAwesomeIcon icon={faArrowRight} className="ms-2" /></>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                {error && (
                                    <div className="error-banner mt-3">
                                        <FontAwesomeIcon icon={faExclamationTriangle} /> {error}
                                    </div>
                                )}
                                {predictionDone && !error && (
                                    <div className="success-banner mt-3">
                                        <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                        Prediction complete for <strong>{ticker}</strong>. Results shown below.
                                    </div>
                                )}
                            </div>

                            {/* Loading overlay */}
                            {loading && (
                                <div className="loading-overlay mb-4">
                                    <div className="spinner-ring"></div>
                                    <p style={{ fontSize: '0.9rem', color: '#8b949e' }}>
                                        Downloading market data &amp; running LSTM inference…
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: '#484f58' }}>This may take 30–60 seconds</p>
                                </div>
                            )}

                            {/* Metrics */}
                            <div className="section-heading">Model Evaluation Metrics</div>
                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <MetricCard label="Mean Squared Error" value={mse} iconClass="blue" accent="blue" />
                                </div>
                                <div className="col-md-4">
                                    <MetricCard label="Root Mean Squared Error" value={rmse} iconClass="green" accent="green" />
                                </div>
                                <div className="col-md-4">
                                    <MetricCard label="R² Score" value={r2} iconClass="purple" accent="purple" />
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="section-heading">Prediction Charts</div>
                            <div className="row g-3">
                                <div className="col-lg-6">
                                    <ChartPanel title="Close Price History" badge="Historical"
                                        badgeClass="bg-primary bg-opacity-25 text-primary" src={plot} alt="Close Price History" />
                                </div>
                                <div className="col-lg-6">
                                    <ChartPanel title="100-Day Moving Average" badge="MA 100"
                                        badgeClass="bg-success bg-opacity-25 text-success" src={ma100plot} alt="100-Day MA" />
                                </div>
                                <div className="col-lg-6">
                                    <ChartPanel title="200-Day Moving Average" badge="MA 200"
                                        badgeClass="bg-warning bg-opacity-25 text-warning" src={ma200plot} alt="200-Day MA" />
                                </div>
                                <div className="col-lg-6">
                                    <ChartPanel title="Final LSTM Prediction" badge="AI Prediction"
                                        badgeClass="bg-danger bg-opacity-25 text-danger" src={prediction} alt="Final Prediction" />
                                </div>
                            </div>
                        </>
                    )}

                    {/* ════════════════════════════════
                        VIEW: HISTORY
                    ════════════════════════════════ */}
                    {view === 'history' && (
                        <>
                            {/* Header row */}
                            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
                                <p style={{ color: '#8b949e', fontSize: '0.85rem', margin: 0 }}>
                                    Every stock prediction you have run is stored here.
                                </p>
                                <div className="d-flex gap-2">
                                    <button className="btn-history-action refresh" onClick={fetchHistory} disabled={historyLoading}>
                                        <FontAwesomeIcon icon={faRedo} spin={historyLoading} className="me-1" />
                                        Refresh
                                    </button>
                                    {history.length > 0 && (
                                        <button className="btn-history-action danger" onClick={handleClearHistory} disabled={clearingHistory}>
                                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                                            {clearingHistory ? 'Clearing…' : 'Clear All'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Error */}
                            {historyError && (
                                <div className="error-banner mb-3">
                                    <FontAwesomeIcon icon={faExclamationTriangle} /> {historyError}
                                </div>
                            )}

                            {/* Loading */}
                            {historyLoading && (
                                <div className="loading-overlay">
                                    <div className="spinner-ring"></div>
                                    <p style={{ fontSize: '0.85rem', color: '#8b949e' }}>Loading history…</p>
                                </div>
                            )}

                            {/* Empty state */}
                            {!historyLoading && !historyError && history.length === 0 && (
                                <div className="history-empty">
                                    <FontAwesomeIcon icon={faHistory}
                                        style={{ fontSize: '3rem', color: '#30363d', marginBottom: '1rem' }} />
                                    <h5 style={{ color: '#8b949e', fontWeight: 600 }}>No predictions yet</h5>
                                    <p style={{ color: '#484f58', fontSize: '0.85rem' }}>
                                        Run your first prediction on the Dashboard to see it here.
                                    </p>
                                    <button className="btn-predict mt-2" style={{ padding: '0.6rem 1.5rem' }}
                                        onClick={() => setView('prediction')}>
                                        Go to Dashboard <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                                    </button>
                                </div>
                            )}

                            {/* History table */}
                            {!historyLoading && history.length > 0 && (
                                <div className="history-table-wrapper">
                                    <table className="history-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Ticker</th>
                                                <th><FontAwesomeIcon icon={faCalendarAlt} className="me-1" />Date</th>
                                                <th><FontAwesomeIcon icon={faClock} className="me-1" />Time</th>
                                                <th>MSE</th>
                                                <th>RMSE</th>
                                                <th>R² Score</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {history.map((item, idx) => (
                                                <tr key={item.id}>
                                                    <td style={{ color: '#484f58' }}>{idx + 1}</td>
                                                    <td>
                                                        <span className="ticker-badge">{item.ticker}</span>
                                                    </td>
                                                    <td style={{ color: '#8b949e' }}>{formatDate(item.created_at)}</td>
                                                    <td style={{ color: '#8b949e' }}>{formatTime(item.created_at)}</td>
                                                    <td style={{ fontFamily: 'monospace', color: '#e6edf3', fontSize: '0.82rem' }}>
                                                        {Number(item.mse).toExponential(3)}
                                                    </td>
                                                    <td style={{ fontFamily: 'monospace', color: '#e6edf3', fontSize: '0.82rem' }}>
                                                        {Number(item.rmse).toExponential(3)}
                                                    </td>
                                                    <td><R2Badge value={item.r2} /></td>
                                                    <td>
                                                        <button className="btn-rerun" onClick={() => handleRerun(item.ticker)}
                                                            title={`Re-run prediction for ${item.ticker}`}>
                                                            <FontAwesomeIcon icon={faRedo} className="me-1" />
                                                            Re-run
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}

                </div>
            </main>
        </div>
    );
};

export default Dashboard;