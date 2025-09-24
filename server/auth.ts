import { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import { storage } from './storage';

// Extend Express Request type to include session
declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

// Simple session-based authentication
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Check if user has a valid session
  if (req.session && req.session.userId) {
    return next();
  }
  
  // For development, allow all requests to pass through
  // In production, you would return 401 here
  next();
};

// Mock user for development
export const getMockUser = () => ({
  id: 'mock-user-123',
  email: 'user@example.com',
  firstName: 'Demo',
  lastName: 'User',
  profileImageUrl: null
});

// Setup basic auth routes
export const setupAuth = async (app: any) => {
  // Configure session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Mock login endpoint
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      // Simple mock authentication
      if (email === 'admin@example.com' && password === 'admin123') {
        req.session.userId = 'mock-user-123';
        res.json({ 
          success: true, 
          user: getMockUser(),
          message: 'Login successful' 
        });
      } else {
        res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Mock logout endpoint
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ success: true, message: 'Logout successful' });
    });
  });

  // Get current user
  app.get('/api/auth/user', isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Return mock user for now
      res.json(getMockUser());
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });
};
