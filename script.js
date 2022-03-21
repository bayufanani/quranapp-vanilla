function addChapter(number, name, translation) {
    let parent = document.getElementById("chapters");
    parent.innerHTML += `
    <div class="chapter">
        <div class="chapter-number">
            ${number}
        </div>
        <div class="chapter-info">
            <div class="chapter-name">
                ${name}
            </div>
            <div class="chapter-translation">
                ${translation}
            </div>
        </div>
    </div>
    `;
}

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

function addVerse(number, arabic, translation) {
    let parent = document.getElementById("chapters");
    parent.innerHTML += `
    <div class="verse">
        <div class="verse-number">
            ${number}
        </div>
        <div class="verse-text">
            <div class="verse-text-arabic">
                ${arabic}
            </div>
            <div class="verse-text-translation">
                ${translation}
            </div>
        </div>
    </div>
    `;
}

async function startApp() {
    let chapters = await makeRequest("GET", "https://api.quran.com/api/v4/chapters?language=id");
    chapters = chapters.chapters;
    for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i];
        addChapter((i + 1), chapter.name_simple, chapter.translated_name.name);
    }
}

function loadVerse() {
    // TODO load verses here when clicked
}

// load after all loaded
window.addEventListener('DOMContentLoaded', (event) => {
    startApp();
});