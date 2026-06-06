# WholeSale Market Management System

A university market management system for managing products, customers, suppliers, purchases, sales, stock, ledgers, reports, staff, and authentication.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Axios
- Backend: Django, Django REST Framework
- Database: MySQL
- Authentication: JWT

## Main Features

- Product catalog with images
- Customer and supplier management
- Sales and purchase management
- Stock tracking
- Ledger and payment management
- Daily and monthly reports
- Admin and regular user roles

## Project Structure

```text
WholeSale/
  frontEnd/          React frontend
  market_database/  Django backend
```

## Run Frontend

```bash
cd frontEnd
npm install
npm run dev
```

## Run Backend

```bash
cd market_database
python manage.py runserver
```

Before running the backend, update the MySQL database name, user, and password in:

```text
market_database/market_database/settings.py
```
## Team Members

This project was developed collaboratively by three Computer Science students as part of our university coursework.

- Ahmad Ali Yaqin
- Khosrow Samadi
- AbdulRahman Rahimi


