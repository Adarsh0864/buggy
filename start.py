#!/usr/bin/env python3
"""
Railway deployment startup script for BugTrackr
This script helps debug deployment issues and ensures proper initialization
"""
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_environment():
    """Check environment variables and configuration"""
    logger.info("=== Environment Check ===")
    logger.info(f"Python version: {sys.version}")
    logger.info(f"PORT: {os.environ.get('PORT', 'Not set')}")
    logger.info(f"DATABASE_URL: {'Set' if os.environ.get('DATABASE_URL') else 'Not set'}")
    logger.info(f"RAILWAY_ENVIRONMENT: {os.environ.get('RAILWAY_ENVIRONMENT', 'Not set')}")
    
def main():
    try:
        check_environment()
        
        # Add the backend directory to the path
        sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
        
        # Import the app
        logger.info("Importing Flask app...")
        from app import app
        
        # Test database connection
        logger.info("Testing database connection...")
        with app.app_context():
            from models import db
            db.session.execute('SELECT 1')
            logger.info("Database connection successful!")
        
        logger.info("App initialization completed successfully!")
        return app
        
    except Exception as e:
        logger.error(f"Error during startup: {e}")
        import traceback
        traceback.print_exc()
        raise

if __name__ == '__main__':
    app = main()
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, port=port, host='0.0.0.0')
else:
    # For Gunicorn
    application = main() 