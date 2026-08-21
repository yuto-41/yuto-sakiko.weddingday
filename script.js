// ============================================================
// Web招待状 script.js 完成版
// ============================================================

// スムーススクロール
document.addEventListener('DOMContentLoaded', function() {

    // ========================================================
    // スクロールアニメーション
    // ========================================================

    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // ========================================================
    // 写真のアニメーション
    // ========================================================

    const storyImages = document.querySelectorAll('.story-image');

    const imageObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, imageObserverOptions);

    storyImages.forEach(image => {
        image.style.opacity = '0';
        image.style.transform = 'translateY(20px)';
        image.style.transition =
            'opacity 0.8s ease, transform 0.8s ease';

        imageObserver.observe(image);
    });


    // ========================================================
    // RSVPボタン
    // ========================================================

    const rsvpButton = document.getElementById('rsvpButton');

    if (rsvpButton) {
        rsvpButton.addEventListener('click', function() {

            const rsvpForm = document.getElementById('rsvpForm');

            if (rsvpForm) {
                rsvpForm.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }


    // ========================================================
    // RSVP Form
    // ========================================================

    const companionYes =
        document.getElementById('companionYes');

    const companionNo =
        document.getElementById('companionNo');

    const companionNameGroup =
        document.getElementById('companionNameGroup');


    // 同伴者あり
    if (
        companionYes &&
        companionNo &&
        companionNameGroup
    ) {

        companionYes.addEventListener('change', function() {

            if (this.checked) {
                companionNameGroup.style.display = 'block';
            }

        });


        // 同伴者なし
        companionNo.addEventListener('change', function() {

            if (this.checked) {

                companionNameGroup.style.display = 'none';

                const companionName =
                    document.getElementById('companionName');

                if (companionName) {
                    companionName.value = '';
                }
            }

        });
    }


    // ========================================================
    // 写真アップロード
    // ========================================================

    let selectedFiles = [];

    const photoUploadButton =
        document.getElementById('photoUploadButton');

    const photoUpload =
        document.getElementById('photoUpload');

    const photoPreviewContainer =
        document.getElementById('photoPreviewContainer');

    const photoCommentGroup =
        document.getElementById('photoCommentGroup');


    if (photoUploadButton && photoUpload) {

        photoUploadButton.addEventListener('click', function() {
            photoUpload.click();
        });


        photoUpload.addEventListener('change', function(e) {

            const files = Array.from(e.target.files);

            files.forEach(function(file) {

                // 写真・動画のみ
                if (
                    file.type.startsWith('image/') ||
                    file.type.startsWith('video/')
                ) {

                    selectedFiles.push(file);

                    addPhotoPreview(file);
                }

            });


            // 写真・動画があればコメント欄表示
            if (
                selectedFiles.length > 0 &&
                photoCommentGroup
            ) {
                photoCommentGroup.style.display = 'block';
            }


            // 同じファイルを再選択できるようにする
            photoUpload.value = '';

        });
    }


    // ========================================================
    // 写真・動画プレビュー
    // ========================================================

    function addPhotoPreview(file) {

        const reader = new FileReader();

        const fileId =
            'file_' +
            Date.now() +
            '_' +
            Math.random()
                .toString(36)
                .substr(2, 9);


        reader.onload = function(e) {

            const previewItem =
                document.createElement('div');

            previewItem.className =
                'photo-preview-item';

            previewItem.dataset.fileId =
                fileId;


            let mediaHTML = '';


            // 画像
            if (file.type.startsWith('image/')) {

                mediaHTML =
                    `<img src="${e.target.result}" alt="Preview">`;

            }


            // 動画
            else if (file.type.startsWith('video/')) {

                mediaHTML =
                    `<video
                        src="${e.target.result}"
                        controls
                        style="
                            width:100%;
                            height:200px;
                            object-fit:cover;
                        "
                    ></video>`;
            }


            previewItem.innerHTML = `
                ${mediaHTML}

                <p class="photo-preview-filename">
                    ${file.name}
                </p>

                <button
                    type="button"
                    class="photo-delete-button"
                    data-file-id="${fileId}"
                >
                    ×
                </button>
            `;


            if (photoPreviewContainer) {
                photoPreviewContainer.appendChild(previewItem);
            }


            // 削除ボタン
            const deleteButton =
                previewItem.querySelector(
                    '.photo-delete-button'
                );


            if (deleteButton) {

                deleteButton.addEventListener(
                    'click',
                    function() {
                        removePhoto(
                            fileId,
                            previewItem
                        );
                    }
                );
            }

        };


        reader.readAsDataURL(file);


        // ファイルにIDを付ける
        file.fileId = fileId;
    }


    // ========================================================
    // 写真削除
    // ========================================================

    function removePhoto(
        fileId,
        previewElement
    ) {

        selectedFiles =
            selectedFiles.filter(function(file) {
                return file.fileId !== fileId;
            });


        if (previewElement) {
            previewElement.remove();
        }


        if (
            selectedFiles.length === 0 &&
            photoCommentGroup
        ) {
            photoCommentGroup.style.display = 'none';
        }
    }


    // ========================================================
    // RSVP送信
    // ========================================================

    const submitButton =
        document.getElementById('submitButton');

    const rsvpForm =
        document.getElementById('rsvpForm');

    const successOverlay =
        document.getElementById('successOverlay');

    const closeSuccessButton =
        document.getElementById('closeSuccessButton');


    // ========================================================
    // Google Apps Script WebアプリURL
    // ========================================================

    const gasUrl =
        'https://script.google.com/macros/s/AKfycbyCEYybP_eh4anuHN8dvgg2peIoB3Dcs2HE1RqDmnfDvJLnnGentE2UjznSC2bWvjym/exec';


    // ========================================================
    // 送信処理
    // ========================================================

    if (submitButton && rsvpForm) {

        submitButton.addEventListener(
            'click',
            async function(e) {

                e.preventDefault();


                // ------------------------------
                // バリデーション
                // ------------------------------

                if (!rsvpForm.checkValidity()) {

                    rsvpForm.reportValidity();

                    return;
                }


                // ------------------------------
                // 送信ボタン無効化
                // ------------------------------

                submitButton.disabled = true;

                const originalButtonText =
                    submitButton.textContent;

                submitButton.textContent =
                    '送信中...';


                try {

                    // ------------------------------
                    // FormData取得
                    // ------------------------------

                    const formData =
                        new FormData(rsvpForm);


                    console.log(
                        '=== FormDataの内容確認 ==='
                    );

                    console.log(
                        'guestName:',
                        formData.get('guestName')
                    );

                    console.log(
                        'guestEmail:',
                        formData.get('guestEmail')
                    );

                    console.log(
                        'attendance:',
                        formData.get('attendance')
                    );

                    console.log(
                        'companion:',
                        formData.get('companion')
                    );

                    console.log(
                        'companionName:',
                        formData.get('companionName')
                    );

                    console.log(
                        'allergies:',
                        formData.get('allergies')
                    );

                    console.log(
                        'message:',
                        formData.get('message')
                    );

                    console.log(
                        'photoComment:',
                        document.getElementById(
                            'photoComment'
                        )?.value
                    );


                    // ------------------------------
                    // ファイル数
                    // ------------------------------

                    console.log(
                        '選択されたファイル数:',
                        selectedFiles.length
                    );


                    // ------------------------------
                    // 写真・動画を変換
                    // ------------------------------

                    const filesData =
                        await Promise.all(
                            selectedFiles.map(
                                file =>
                                    convertFileToBase64(file)
                            )
                        );


                    console.log(
                        '変換されたファイルデータ:',
                        filesData
                    );

                    console.log(
                        'files配列の要素数:',
                        filesData.length
                    );


                    // ------------------------------
                    // 送信データ作成
                    // ------------------------------

                    const data = {

                        name:
                            formData.get('guestName'),

                        email:
                            formData.get('guestEmail'),

                        attendance:
                            formData.get('attendance'),

                        companion:
                            formData.get('companion'),

                        companionName:
                            formData.get(
                                'companionName'
                            ) || '',

                        allergies:
                            formData.get(
                                'allergies'
                            ) || '',

                        message:
                            formData.get(
                                'message'
                            ) || '',

                        photoComment:
                            document.getElementById(
                                'photoComment'
                            )?.value || '',

                        files:
                            filesData
                    };


                    // ------------------------------
                    // デバッグ
                    // ------------------------------

                    console.log(
                        '=== 送信データ全体 ==='
                    );

                    console.log(
                        '送信先URL:',
                        gasUrl
                    );

                    console.log(
                        'name:',
                        data.name
                    );

                    console.log(
                        'email:',
                        data.email
                    );

                    console.log(
                        'attendance:',
                        data.attendance
                    );

                    console.log(
                        'companion:',
                        data.companion
                    );

                    console.log(
                        'companionName:',
                        data.companionName
                    );

                    console.log(
                        'allergies:',
                        data.allergies
                    );

                    console.log(
                        'message:',
                        data.message
                    );

                    console.log(
                        'photoComment:',
                        data.photoComment
                    );

                    console.log(
                        'files配列:',
                        data.files
                    );


                    // ------------------------------
                    // JSONサイズ
                    // ------------------------------

                    const jsonData =
                        JSON.stringify(data);

                    console.log(
                        'JSONサイズ:',
                        jsonData.length,
                        'bytes'
                    );


                    // ------------------------------
                    // GASへ送信
                    // ------------------------------

                    const response =
                        await fetch(
                            gasUrl,
                            {
                                method: 'POST',

                                mode: 'no-cors',

                                headers: {
                                    'Content-Type':
                                        'application/json'
                                },

                                body: jsonData
                            }
                        );


                    console.log(
                        'GAS送信完了'
                    );


                    // ------------------------------
                    // 成功表示
                    // ------------------------------

                    alert(
                        'ご回答ありがとうございました！'
                    );


                    showSuccessMessage();


                    // ------------------------------
                    // フォームリセット
                    // ------------------------------

                    resetForm();

                }


                catch (error) {

                    console.error(
                        '送信エラー:',
                        error
                    );


                    alert(
                        '送信中にエラーが発生しました。\n' +
                        '写真のサイズが大きすぎる可能性があります。\n' +
                        'もう一度お試しください。'
                    );

                }


                finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;
                }

            }
        );
    }


    // ========================================================
    // 写真・動画をBase64に変換
    // ========================================================

    async function convertFileToBase64(file) {

        // ====================================================
        // 動画
        // ====================================================

        if (
            file.type.startsWith('video/')
        ) {

            return new Promise(
                function(resolve, reject) {

                    const reader =
                        new FileReader();


                    reader.onload =
                        function(e) {

                            try {

                                const result =
                                    e.target.result;

                                const base64String =
                                    result.split(',')[1];


                                console.log(
                                    '動画変換完了:',
                                    file.name,
                                    'サイズ:',
                                    file.size
                                );


                                resolve({

                                    fileData:
                                        base64String,

                                    fileName:
                                        file.name,

                                    fileType:
                                        file.type

                                });

                            }

                            catch(error) {

                                reject(error);
                            }
                        };


                    reader.onerror =
                        reject;


                    reader.readAsDataURL(file);

                }
            );
        }


        // ====================================================
        // 画像以外
        // ====================================================

        if (
            !file.type.startsWith('image/')
        ) {

            throw new Error(
                '対応していないファイル形式です'
            );
        }


        // ====================================================
        // 画像読み込み
        // ====================================================

        const imageData =
            await readFileAsDataURL(file);


        const img =
            await loadImage(imageData);


        // ====================================================
        // 圧縮設定
        // ====================================================

        const MAX_WIDTH = 1600;

        const MAX_HEIGHT = 1600;

        const TARGET_SIZE =
            800 * 1024;

        const MIN_QUALITY = 0.55;

        const START_QUALITY = 0.78;


        let width =
            img.naturalWidth;

        let height =
            img.naturalHeight;


        // ====================================================
        // 最大サイズに合わせる
        // ====================================================

        if (
            width > MAX_WIDTH ||
            height > MAX_HEIGHT
        ) {

            const ratio =
                Math.min(
                    MAX_WIDTH / width,
                    MAX_HEIGHT / height
                );


            width =
                Math.round(
                    width * ratio
                );

            height =
                Math.round(
                    height * ratio
                );
        }


        // ====================================================
        // JPEG圧縮
        // ====================================================

        let quality =
            START_QUALITY;

        let blob =
            await resizeAndCompressImage(
                img,
                width,
                height,
                quality
            );


        // ====================================================
        // 800KBを超える場合
        // 品質を下げて再圧縮
        // ====================================================

        while (
            blob.size > TARGET_SIZE &&
            quality > MIN_QUALITY
        ) {

            quality -= 0.05;


            blob =
                await resizeAndCompressImage(
                    img,
                    width,
                    height,
                    quality
                );
        }


        // ====================================================
        // それでも大きい場合はさらに縮小
        // ====================================================

        while (
            blob.size > TARGET_SIZE &&
            width > 1000
        ) {

            width =
                Math.round(width * 0.85);

            height =
                Math.round(height * 0.85);


            quality =
                START_QUALITY;


            blob =
                await resizeAndCompressImage(
                    img,
                    width,
                    height,
                    quality
                );


            while (
                blob.size > TARGET_SIZE &&
                quality > MIN_QUALITY
            ) {

                quality -= 0.05;


                blob =
                    await resizeAndCompressImage(
                        img,
                        width,
                        height,
                        quality
                    );
            }
        }


        // ====================================================
        // Base64化
        // ====================================================

        const compressedData =
            await readBlobAsDataURL(blob);


        const base64String =
            compressedData.split(',')[1];


        // ====================================================
        // ファイル名変更
        // ====================================================

        const originalName =
            file.name.replace(
                /\.[^/.]+$/,
                ''
            );


        const newFileName =
            originalName + '.jpg';


        console.log(
            '画像圧縮完了:',
            file.name
        );

        console.log(
            '元サイズ:',
            file.size,
            'bytes'
        );

        console.log(
            '圧縮後:',
            blob.size,
            'bytes'
        );

        console.log(
            '圧縮後サイズ:',
            Math.round(
                blob.size / 1024
            ),
            'KB'
        );

        console.log(
            '圧縮率:',
            Math.round(
                (1 - blob.size / file.size) * 100
            ) + '%'
        );


        return {

            fileData:
                base64String,

            fileName:
                newFileName,

            fileType:
                'image/jpeg'

        };
    }


    // ========================================================
    // File → DataURL
    // ========================================================

    function readFileAsDataURL(file) {

        return new Promise(
            function(resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function(e) {

                        resolve(
                            e.target.result
                        );
                    };


                reader.onerror =
                    reject;


                reader.readAsDataURL(file);

            }
        );
    }


    // ========================================================
    // DataURL → Image
    // ========================================================

    function loadImage(dataURL) {

        return new Promise(
            function(resolve, reject) {

                const img =
                    new Image();


                img.onload =
                    function() {

                        resolve(img);
                    };


                img.onerror =
                    function() {

                        reject(
                            new Error(
                                '画像の読み込みに失敗しました'
                            )
                        );
                    };


                img.src =
                    dataURL;

            }
        );
    }


    // ========================================================
    // Image → JPEG Blob
    // ========================================================

    function resizeAndCompressImage(
        img,
        width,
        height,
        quality
    ) {

        return new Promise(
            function(resolve, reject) {

                try {

                    const canvas =
                        document.createElement(
                            'canvas'
                        );


                    canvas.width =
                        width;

                    canvas.height =
                        height;


                    const ctx =
                        canvas.getContext(
                            '2d'
                        );


                    if (!ctx) {

                        reject(
                            new Error(
                                'Canvasを取得できません'
                            )
                        );

                        return;
                    }


                    // 白背景
                    ctx.fillStyle =
                        '#ffffff';

                    ctx.fillRect(
                        0,
                        0,
                        width,
                        height
                    );


                    // 画像描画
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );


                    canvas.toBlob(
                        function(blob) {

                            if (!blob) {

                                reject(
                                    new Error(
                                        '画像の圧縮に失敗しました'
                                    )
                                );

                                return;
                            }


                            resolve(blob);

                        },
                        'image/jpeg',
                        quality
                    );

                }

                catch(error) {

                    reject(error);
                }

            }
        );
    }


    // ========================================================
    // Blob → DataURL
    // ========================================================

    function readBlobAsDataURL(blob) {

        return new Promise(
            function(resolve, reject) {

                const reader =
                    new FileReader();


                reader.onload =
                    function(e) {

                        resolve(
                            e.target.result
                        );
                    };


                reader.onerror =
                    reject;


                reader.readAsDataURL(blob);

            }
        );
    }


    // ========================================================
    // フォームリセット
    // ========================================================

    function resetForm() {

        if (rsvpForm) {
            rsvpForm.reset();
        }


        selectedFiles = [];


        if (photoPreviewContainer) {

            photoPreviewContainer.innerHTML =
                '';
        }


        if (photoCommentGroup) {

            photoCommentGroup.style.display =
                'none';
        }


        const photoComment =
            document.getElementById(
                'photoComment'
            );


        if (photoComment) {
            photoComment.value = '';
        }


        const companionNameGroup =
            document.getElementById(
                'companionNameGroup'
            );


        if (companionNameGroup) {

            companionNameGroup.style.display =
                'none';
        }

    }


    // ========================================================
    // 成功メッセージ
    // ========================================================

    function showSuccessMessage() {

        if (successOverlay) {

            successOverlay.style.display =
                'flex';

            document.body.style.overflow =
                'hidden';
        }
    }


    // ========================================================
    // 成功メッセージを閉じる
    // ========================================================

    if (
        closeSuccessButton &&
        successOverlay
    ) {

        closeSuccessButton.addEventListener(
            'click',
            function() {

                successOverlay.style.display =
                    'none';

                document.body.style.overflow =
                    '';


                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            }
        );
    }


    // ========================================================
    // ヒーローセクション
    // ========================================================

    const heroContent =
        document.querySelector(
            '.hero-content'
        );


    if (heroContent) {

        setTimeout(function() {

            heroContent.style.opacity =
                '0';

            heroContent.style.transform =
                'translateY(30px)';

            heroContent.style.transition =
                'opacity 1s ease, transform 1s ease';


            setTimeout(function() {

                heroContent.style.opacity =
                    '1';

                heroContent.style.transform =
                    'translateY(0)';

            }, 100);

        }, 100);
    }

});


// ============================================================
// スムーススクロール
// ============================================================

document.querySelectorAll(
    'a[href^="#"]'
).forEach(function(anchor) {

    anchor.addEventListener(
        'click',
        function(e) {

            e.preventDefault();


            const target =
                document.querySelector(
                    this.getAttribute('href')
                );


            if (target) {

                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

            }

        }
    );

});