function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

async function startApp() {
    let parent = document.getElementById("chapters");
    let chapters = await makeRequest("GET", "https://api.quran.com/api/v4/chapters?language=id");
    chapters = chapters.chapters;
    let innerHTML = "";
    for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i];
        let number = i + 1;
        innerHTML += `
        <div class="chapter" onclick="loadVerse(${number}, ${chapter.verses_count})">
            <div class="chapter-number">
                ${number}
            </div>
            <div class="chapter-info">
                <div class="chapter-name">
                    ${chapter.name_simple}
                </div>
                <div class="chapter-translation">
                    ${chapter.translated_name.name}
                </div>
            </div>
        </div>
        `;
        // addChapter((i + 1), chapter.name_simple, chapter.translated_name.name, chapter.verses_count);
    }
    parent.innerHTML = innerHTML;
}

async function loadVerse(chapter, numberOfAyahs) {
    let parent = document.getElementById("verses");
    let verses = await makeRequest("GET", "https://api.quran.com/api/v4/verses/by_chapter/" + chapter + "?language=en&words=false&translations=quran.id&fields=text_indopak&per_page=" + numberOfAyahs);
    verses = verses.verses;
    let innerHTML = "";
    for (const i of verses) {
        let verse = i;
        innerHTML += `
        <div class="verse">
            <div class="verse-number">
                ${verse.verse_number}
            </div>
            <div class="verse-text">
                <div class="verse-text-arabic">
                    ${verse.text_indopak}
                </div>
                <div class="verse-text-translation">
                    ${verse.translations[0].text}
                </div>
            </div>
        </div>
        `;
        // addVerse(verse.verse_number, verse.text_indopak, verse.translations.text);
    }
    parent.innerHTML = innerHTML;
}

// load after all loaded
window.addEventListener('DOMContentLoaded', (event) => {
    startApp();
});