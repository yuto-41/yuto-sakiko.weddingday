// 写真を自動圧縮してBase64に変換する
function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {

        // 動画は現状のまま処理
        if (file.type.startsWith('video/')) {
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const result = e.target.result;
                    const base64String = result.split(',')[1];

                    resolve({
                        fileData: base64String,
                        fileName: file.name,
                        fileType: file.type
                    });

                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
            return;
        }

        // 画像以外は通常処理
        if (!file.type.startsWith('image/')) {
            reject(new Error('対応していないファイル形式です'));
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {

            const img = new Image();

            img.onload = function() {

                try {

                    // ==========================
                    // 圧縮設定
                    // ==========================

                    const MAX_WIDTH = 1600;
                    const MAX_HEIGHT = 1600;
                    const JPEG_QUALITY = 0.78;

                    let width = img.width;
                    let height = img.height;

                    // 縦横比を維持して縮小
                    if (width > MAX_WIDTH || height > MAX_HEIGHT) {

                        const ratio = Math.min(
                            MAX_WIDTH / width,
                            MAX_HEIGHT / height
                        );

                        width = Math.round(width * ratio);
                        height = Math.round(height * ratio);
                    }

                    // Canvasを作成
                    const canvas = document.createElement('canvas');

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');

                    // 白背景
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, width, height);

                    // 画像を描画
                    ctx.drawImage(
                        img,
                        0,
                        0,
                        width,
                        height
                    );

                    // JPEGとして圧縮
                    canvas.toBlob(
                        function(blob) {

                            if (!blob) {
                                reject(new Error('画像の圧縮に失敗しました'));
                                return;
                            }

                            const compressedReader = new FileReader();

                            compressedReader.onload = function(event) {

                                try {

                                    const result = event.target.result;

                                    const base64String =
                                        result.split(',')[1];

                                    // 拡張子をJPEGに変更
                                    const originalName =
                                        file.name.replace(
                                            /\.[^/.]+$/,
                                            ''
                                        );

                                    const newFileName =
                                        originalName + '.jpg';

                                    console.log(
                                        '画像圧縮完了:',
                                        file.name,
                                        '元サイズ:',
                                        file.size,
                                        '圧縮後:',
                                        blob.size
                                    );

                                    console.log(
                                        '圧縮率:',
                                        Math.round(
                                            (1 - blob.size / file.size) * 100
                                        ) + '%'
                                    );

                                    resolve({
                                        fileData: base64String,
                                        fileName: newFileName,
                                        fileType: 'image/jpeg'
                                    });

                                } catch (error) {
                                    reject(error);
                                }
                            };

                            compressedReader.onerror = reject;

                            compressedReader.readAsDataURL(blob);

                        },
                        'image/jpeg',
                        JPEG_QUALITY
                    );

                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = function() {
                reject(new Error('画像の読み込みに失敗しました'));
            };

            img.src = e.target.result;
        };

        reader.onerror = function(error) {
            reject(error);
        };

        reader.readAsDataURL(file);
    });
}