from waitress import serve
from app import app
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == '__main__':
    logger.info("Starting production server with Waitress...")
    serve(
        app, 
        host='127.0.0.1', 
        port=5000, 
        threads=4,
        connection_limit=1000,
        channel_timeout=30
    )