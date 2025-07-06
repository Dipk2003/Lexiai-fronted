import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Register: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    firstName,
                    lastName,
                    firmName: 'Demo Law Firm', // Default value for demo
                    firmEmail: email,
                    firmPhone: '',
                    firmAddress: '',
                    firmCity: '',
                    firmState: '',
                    firmCountry: 'India'
                }),
            })

            const data = await response.json()

            if (response.ok) {
                console.log('✅ Registration successful, navigating to login')
                alert('Registration successful! You can now log in.')
                onBackToLogin()
            } else {
                throw new Error(data.message || 'Registration failed')
            }
        } catch (err) {
            console.error('❌ Registration error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1>Register</h1>
                    <p>Create your account</p>
                </div>
                <form onSubmit={handleRegister} className="register-form">
                    {error && <div className="error">{error}</div>}
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p style={{ color: '#666', fontSize: '0.9rem' }}>
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onBackToLogin}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#1976d2',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
