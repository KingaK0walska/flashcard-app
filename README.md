# 📚 Flashcard Learning App 

Flashcard Learning App to aplikacja webowa do nauki poprzez fiszki, stworzona jako projekt zaliczeniowy z przedmiotu  
**„Aplikacje internetowe"** . Umożliwia efektywną naukę dzięki metodzie aktywnego przypominania.  
Użytkownik może tworzyć własne talie fiszek, zarządzać nimi oraz monitorować postępy nauki poprzez interaktywny tryb nauki.

**Autor:** Kinga Kowalska  

## Główne funkcjonalności

### Autoryzacja i bezpieczeństwo
- Rejestracja i logowanie użytkownika
- JWT (token ważny 7 dni)
- Hashowanie haseł bcrypt
- Walidacja danych (Joi + HTML5)
- Middleware autoryzacji
- Ochrona przed NoSQL Injection

### Nauka i zarządzanie fiszkami
- Tworzenie oraz zarządzanie taliami i fiszkami
- Kategorie tematyczne i licznik fiszek
- Interaktywny tryb nauki z losowaniem kart, animacjami 3D i śledzeniem postępów
- Statystyki nauki, skuteczność oraz historia odpowiedzi

## Technologie

### Backend
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Joi

### Frontend
- React.js
- React Router DOM
- Axios
- CSS Modules

### Architektura
- MVC
- REST API
- Protected Routes


## Wymagania systemowe

- Node.js v22+
- MongoDB v8+
- npm v10+


## Wygląd aplikacji
### Strona logowania 
![Login](screenshots/login.png) 
### Dashboard z taliami 
![Dashboard](screenshots/dashboard.png) 
### Szczegóły talii z fiszkami
 ![Deck Detail](screenshots/deck-detail.png)
### Tryb nauki 
![Study Mode](screenshots/study-mode.png) 


## Instalacja

### 1. Klonowanie projektu
```bash
git clone https://github.com/KingaK0walska/flashcard-app.git
cd flashcard-app
```
### 2. Backend

```bash
cd server
npm install
``

Plik `.env`:

```env
DB=mongodb://localhost/flashcard_app
JWTPRIVATEKEY=your_secret_key
SALT=10
PORT=3001
``

Uruchomienie:

```bash
npm start
```

### 3. Frontend

```bash
cd client
npm install
npm start
```

---

## Konto testowe

**Email:** [kinga@example.com](mailto:kinga@example.com)
**Hasło:** Haslo123.

---

## Ważne informacje

* MongoDB musi być uruchomione
* Backend i frontend działają równocześnie
* Dane użytkowników są prywatne
* Nie należy commitować pliku `.env`

---

## Wykorzystane koncepcje

* MVC
* CRUD
* JWT Authentication
* Middleware
* Async/Await
* React Hooks
* CSS Animations


## Licencja

Projekt edukacyjny stworzony na potrzeby zaliczenia przedmiotu.

