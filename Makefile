.PHONY: serve clean screenshot help

PORT ?= 8000

help:
	@echo "Available targets:"
	@echo "  make serve      - Start local Python HTTP server (port $(PORT))"
	@echo "  make screenshot - Generate screenshot for README (requires server running)"
	@echo "  make clean      - Clean up temporary files"
	@echo "  make help       - Show this help message"

serve:
	@echo "Starting server at http://localhost:$(PORT)"
	@echo "Press Ctrl+C to stop"
	@cd html && python3 -m http.server $(PORT)

screenshot:
	@echo "📸 Generating screenshot..."
	@echo "⚠️  Make sure the server is running (make serve)"
	@node scripts/screenshot.js

clean:
	@find . -type f -name "*.pyc" -delete
	@find . -type d -name "__pycache__" -delete
	@echo "Cleaned up temporary files"
