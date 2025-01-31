import { Hono } from 'hono';
import { css, cx, keyframes, Style } from 'hono/css';
import { basicAuth } from 'hono/basic-auth';

const mainPageRouter = new Hono();
const app = new Hono();

mainPageRouter.get('/', (c) => {
    // 五線譜コンテナのスタイル
    const musicSheetStyle = css`
        width: 80%;
        height: 150px;
        margin: 20px auto;
        position: relative;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        overflow: hidden; /* 🎯 はみ出し防止 */
        padding: 10px; /* 🎯 内側に余裕を持たせる */
        white-space: nowrap; /* 🎯 五線譜が折り返されないようにする */

        /* 五線譜の線 */
        &::before {
            content: '';
            position: absolute;
            top: 30px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: black;
            box-shadow: 0 20px 0 0 black, 0 40px 0 0 black, 0 60px 0 0 black, 0 80px 0 0 black;
        }
    `;

    // ト音記号のスタイル
    const clefStyle = css`
        position: absolute;
        top: 10px;
        left: -10px;
        width: 100px;
        height: auto;
    `;

    // ヘッダーのスタイル
    const headerStyle = css`
        text-align: center;
        margin-top: 50px;
        font-size: 24px;
        font-weight: bold;
    `;

    // ボタンのスタイル
    const buttonStyle = css`
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: #0056b3;
        }
    `;

    const resetButtonStyle = css`
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #dc3545; /* 赤系のボタン */
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
            background-color: #a71d2a;
        }
    `;



    // **とりまJS**
    const script = `
        document.addEventListener("DOMContentLoaded", function() {
            const button = document.getElementById("generate-btn");
            const resetButton = document.getElementById("reset-btn"); // **リセットボタンを取得**
            const sheet = document.getElementById("music-sheet");
            let noteCount = 0;
            const maxNotes = 25;

            button.addEventListener("click", function() {
                if (noteCount >= maxNotes) return;

                const notes = [
                    "https://github.com/KYOyKA/images/blob/main/%E5%9B%9B%E5%88%86%E9%9F%B3%E7%AC%A6.png?raw=true",
                    "https://github.com/KYOyKA/images/blob/main/%E5%8D%81%E5%85%AD%E5%88%86%E9%9F%B3%E7%AC%A6.png?raw=true",
                    "https://github.com/KYOyKA/images/blob/main/%E5%85%AB%E5%88%86%E9%9F%B3%E7%AC%A6.png?raw=true",
                    "https://github.com/KYOyKA/images/blob/main/%E4%BA%8C%E5%88%86%E9%9F%B3%E7%AC%A6.png?raw=true"
                ];
                const randomIndex = Math.floor(Math.random() * notes.length);

                const positions = [67, 57, 47, 37, 27, 17, 7, -3, -13, -23, -33];
                const randomPosIndex = Math.floor(Math.random() * positions.length);
                const randomPos = positions[randomPosIndex];

                const noteImg = document.createElement("img");
                noteImg.src = notes[randomIndex];
                noteImg.className = "note";
                noteImg.style.position = "absolute";
                noteImg.style.top = randomPos + "px";

                let noteWidth = 22;
                let topAdjustment = 0;
                let rotateAngle = 0;

                if (noteImg.src.includes("%E5%8D%81%E5%85%AD%E5%88%86%E9%9F%B3%E7%AC%A6") || noteImg.src.includes("%E5%85%AB%E5%88%86%E9%9F%B3%E7%AC%A6")) {
                    noteWidth = 42;
                    topAdjustment = -8.5;
                }

                noteImg.style.top = (randomPos + topAdjustment) + "px";
                noteImg.style.width = noteWidth + "px";
                noteImg.style.height = "auto";

                const spacing = 50;
                const noteLeft = (noteCount * spacing + 100);
                noteImg.style.left = noteLeft + "px";

                // **シ（B）以上の音（randomPos が 7 未満）の場合、180度回転（点対称）**
                if (randomPos < 8) {
                    rotateAngle = 180;
                    noteImg.style.transformOrigin = "center 87.5%"; // **符頭の中心を軸にする**
                } else {
                    noteImg.style.transformOrigin = "center bottom"; // **通常時の軸**
                }

                // **回転適用**
                noteImg.style.transform = \`rotate(\${rotateAngle}deg)\`;

                sheet.appendChild(noteImg);
                noteCount++;

                if (Math.random() < 0.2) {
                    const dotImg = document.createElement("img");
                    dotImg.src = "https://github.com/KYOyKA/images/blob/main/%E4%BB%98%E7%82%B9.png?raw=true";
                    dotImg.className = "dot";
                    dotImg.style.position = "absolute";
                    dotImg.style.width = "10px";
                    dotImg.style.height = "auto";
                    if (randomPos < 8 && noteImg.src.includes("%E5%8D%81%E5%85%AD%E5%88%86%E9%9F%B3%E7%AC%A6") || noteImg.src.includes("%E5%85%AB%E5%88%86%E9%9F%B3%E7%AC%A6")) {
                        dotImg.style.left = (noteLeft + 45) + "px";
                    } else {
                        dotImg.style.left = (noteLeft + 30) + "px";
                    }
                    let dotTop = randomPos + topAdjustment;

                    dotImg.style.top = dotTop + 60 + "px";

                    sheet.appendChild(dotImg);
                }

                if (randomPosIndex == 0) {
                    const lineImg = document.createElement("img");
                    lineImg.src = "https://github.com/KYOyKA/images/blob/main/%E7%B7%9A.png?raw=true";
                    lineImg.className = "line";
                    lineImg.style.position = "absolute";
                    lineImg.style.width = "35px";
                    lineImg.style.height = "auto";
                    lineImg.style.left = (noteLeft - 5) + "px";
                    let lineTop = randomPos - 2.5;
                    lineImg.style.top = lineTop + 65 + "px";

                    sheet.appendChild(lineImg);
                }

                if (noteCount >= maxNotes) {
                    button.disabled = true;
                    button.style.backgroundColor = "gray";
                    button.style.cursor = "not-allowed";
                }
            });

            // **リセットボタンの処理**
            resetButton.addEventListener("click", function() {
                // **ト音記号以外を削除**
                const notes = document.querySelectorAll("#music-sheet img:not(.clef)");
                notes.forEach(note => note.remove());

                // **カウントをリセット**
                noteCount = 0;

                // **生成ボタンを有効化**
                button.disabled = false;
                button.style.backgroundColor = "#007bff"; // **元の色に戻す**
                button.style.cursor = "pointer";
            });
        });
    `;

    return c.html(
        <html>
            <head>
                <title>randommelody</title>
                <Style />
            </head>
            <body>
                <h1 class={headerStyle}>メロディ生成君</h1>
                <div>
                    <button id="generate-btn" class={buttonStyle}>生成！</button>
                    <button id="reset-btn" class={resetButtonStyle}>リセット</button>
                </div>

                <div id="music-sheet" class={musicSheetStyle}>
                    <img
                        src='https://github.com/KYOyKA/images/blob/main/%E3%83%88%E9%9F%B3%E8%A8%98%E5%8F%B7.png?raw=true'
                        alt="ト音記号"
                        class={cx(clefStyle, "clef")} 
                    />
                </div>

                <script dangerouslySetInnerHTML={{ __html: script }} />
            </body>
        </html>
    );
});

// Basic認証を追加
const authMiddleware = basicAuth({
    username: 'helpme',
    password: 'erin',
});
mainPageRouter.use('*', authMiddleware);

// ルーターをエクスポート
export default mainPageRouter;
