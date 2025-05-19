import { useContext, useState } from 'react';
import { UserContext } from '../contexts/UserContext';

export default function AuthPage() {
  const { token, loginUser, logoutUser } = useContext(UserContext);
  const [inputToken, setInputToken] = useState('');

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Authentication Test Page</h1>

      <p>Status: {token ? 'Logged in' : 'Logged out'}</p>

      {!token && (
        <>
          <input
            type="text"
            placeholder="Enter fake token to login"
            value={inputToken}
            onChange={(e) => setInputToken(e.target.value)}
          />
          <button
            onClick={() => {
              if (inputToken.trim()) {
                loginUser(inputToken.trim());
                setInputToken('');
              }
            }}
          >
            Login
          </button>
        </>
      )}

      {token && (
        <button onClick={logoutUser} style={{ marginTop: 10 }}>
          Logout
        </button>
      )}
    </div>
  );
}
