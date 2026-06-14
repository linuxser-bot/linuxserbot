module.exports = async function birthdayFull(sock, chatId, message) {
    try {

        const text =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text ||
            '';

        const args = text.split(' ').slice(1);
        const dob = args[0]; // DD-MM-YYYY

        if (!dob) {
            return sock.sendMessage(chatId, {
                text: `
🎂 *Birthday Calculator*

📌 Usage:
.bday DD-MM-YYYY

💡 Example:
.bday 25-12-2005
`.trim()
            }, { quoted: message });
        }

        const [day, month, year] = dob.split('-').map(Number);

        if (!day || !month || !year) {
            return sock.sendMessage(chatId, {
                text: "❌ Invalid format! Use DD-MM-YYYY"
            }, { quoted: message });
        }

        const birthDate = new Date(year, month - 1, day);
        const now = new Date();

        if (birthDate > now) {
            return sock.sendMessage(chatId, {
                text: "❌ Birth date cannot be in the future!"
            }, { quoted: message });
        }

        // ---------------- AGE CALCULATION ----------------
        const diff = now - birthDate;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        const years = now.getFullYear() - birthDate.getFullYear();

        const hasHadBirthdayThisYear =
            (now.getMonth() > birthDate.getMonth()) ||
            (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());

        const exactYears = hasHadBirthdayThisYear ? years : years - 1;

        const remainingDays = days % 365;
        const remainingMonths = Math.floor(remainingDays / 30);

        // ---------------- NEXT BIRTHDAY ----------------
        let nextBirthday = new Date(now.getFullYear(), month - 1, day);

        if (nextBirthday < now) {
            nextBirthday = new Date(now.getFullYear() + 1, month - 1, day);
        }

        const msDiff = nextBirthday - now;

        const daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
        const weeksLeft = Math.floor(daysLeft / 7);
        const monthsLeft = Math.floor(daysLeft / 30);

        const weekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const nextDayName = weekDays[nextBirthday.getDay()];

        // ---------------- OUTPUT ----------------
        const result = `
🎂 *Birthday Full Analysis*

📅 Birth Date: ${dob}

🎉 Age:
• Years: ${exactYears}
• Months: ${remainingMonths}
• Weeks: ${weeks}
• Days: ${days}
• Hours: ${hours}
• Minutes: ${minutes}
• Seconds: ${seconds}

🎂 Next Birthday:
• Date: ${day}-${month}-${nextBirthday.getFullYear()}
• Day: ${nextDayName}

⏳ Countdown:
• Days Left: ${daysLeft}
• Weeks Left: ${weeksLeft}
• Months Left: ${monthsLeft}
`.trim();

        return sock.sendMessage(chatId, {
            text: result
        }, { quoted: message });

    } catch (err) {
        console.log("BIRTHDAY FULL ERROR:", err);

        return sock.sendMessage(chatId, {
            text: "❌ Calculation failed. Check format DD-MM-YYYY"
        }, { quoted: message });
    }
};
