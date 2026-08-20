// スムーススクロール
document.addEventListener('DOMContentLoaded', function() {
    // スクロールアニメーション
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

    // 写真のアニメーション
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
        image.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        imageObserver.observe(image);
    });

    // RSVPボタン
    const rsvpButton = document.getElementById('rsvpButton');
    
    if (rsvpButton) {
        rsvpButton.addEventListener('click', function() {
            // 実際の実装では、フォームページへの遷移やモーダル表示などを実装
            alert('出欠のご連絡ありがとうございます。\n\n別途、メールまたはお電話にてご連絡させていただきます。');
            
            // または、メールクライアントを開く場合:
            // window.location.href = 'mailto:your-email@example.com?subject=結婚式出欠連絡&body=お名前：%0D%0A出欠：';
        });
    }

    // ===== RSVP Form Functionality =====
    
    // 同伴者の有無の切り替え
    const companionYes = document.getElementById('companionYes');
    const companionNo = document.getElementById('companionNo');
    const companionNameGroup = document.getElementById('companionNameGroup');
    
    if (companionYes && companionNo && companionNameGroup) {
        companionYes.addEventListener('change', function() {
            if (this.checked) {
                companionNameGroup.style.display = 'block';
            }
        });
        
        companionNo.addEventListener('change', function() {
            if (this.checked) {
                companionNameGroup.style.display = 'none';
                document.getElementById('companionName').value = '';
            }
        });
    }
    
    // 写真アップロード機能
    let selectedFiles = [];
    
    const photoUploadButton = document.getElementById('photoUploadButton');
    const photoUpload = document.getElementById('photoUpload');
    const photoPreviewContainer = document.getElementById('photoPreviewContainer');
    const photoCommentGroup = document.getElementById('photoCommentGroup');
    
    if (photoUploadButton && photoUpload) {
        photoUploadButton.addEventListener('click', function() {
            photoUpload.click();
        });
        
        photoUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files);
            
            files.forEach(file => {
                // 画像または動画ファイルのみ受け入れ
                if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                    selectedFiles.push(file);
                    addPhotoPreview(file);
                }
            });
            
            // コメント欄を表示
            if (selectedFiles.length > 0 && photoCommentGroup) {
                photoCommentGroup.style.display = 'block';
            }
            
            // input をリセット（同じファイルを再選択可能にする）
            photoUpload.value = '';
        });
    }
    
    // 写真・動画プレビューを追加
    function addPhotoPreview(file) {
        const reader = new FileReader();
        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'photo-preview-item';
            previewItem.dataset.fileId = fileId;
            
            // 画像か動画かで表示を切り替え
            let mediaHTML;
            if (file.type.startsWith('image/')) {
                mediaHTML = `<img src="${e.target.result}" alt="Preview">`;
            } else if (file.type.startsWith('video/')) {
                mediaHTML = `<video src="${e.target.result}" controls style="width: 100%; height: 200px; object-fit: cover;"></video>`;
            }
            
            previewItem.innerHTML = `
                ${mediaHTML}
                <p class="photo-preview-filename">${file.name}</p>
                <button type="button" class="photo-delete-button" data-file-id="${fileId}">×</button>
            `;
            
            photoPreviewContainer.appendChild(previewItem);
            
            // 削除ボタンのイベント
            const deleteButton = previewItem.querySelector('.photo-delete-button');
            deleteButton.addEventListener('click', function() {
                removePhoto(fileId, previewItem);
            });
        };
        
        reader.readAsDataURL(file);
        
        // ファイルIDをファイルオブジェクトに紐付け
        file.fileId = fileId;
    }
    
    // 写真を削除
    function removePhoto(fileId, previewElement) {
        // selectedFiles配列から削除
        selectedFiles = selectedFiles.filter(file => file.fileId !== fileId);
        
        // プレビュー要素を削除
        previewElement.remove();
        
        // 写真がなくなったらコメント欄を非表示
        if (selectedFiles.length === 0 && photoCommentGroup) {
            photoCommentGroup.style.display = 'none';
        }
    }
    
    // フォーム送信処理（GAS連携）
    const submitButton = document.getElementById('submitButton');
    const rsvpForm = document.getElementById('rsvpForm');
    const successOverlay = document.getElementById('successOverlay');
    const closeSuccessButton = document.getElementById('closeSuccessButton');
    
    // GAS WebアプリのURL
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxhCHYKaaerZ9k8k9lkMAx1fkk_B7GmlYXGzQjbtmudUwv6xwWHVJ8ncgiGbmtFr6St/exec';
    
    if (submitButton && rsvpForm) {
        submitButton.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // フォームバリデーション
            if (!rsvpForm.checkValidity()) {
                rsvpForm.reportValidity();
                return;
            }
            
            // 送信ボタンを無効化
            submitButton.disabled = true;
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = '送信中...';
            
            try {
                // フォームデータを取得
                const formData = new FormData(rsvpForm);
                
                console.log('=== FormDataの内容確認 ===');
                console.log('guestName:', formData.get('guestName'));
                console.log('guestEmail:', formData.get('guestEmail'));
                console.log('attendance:', formData.get('attendance'));
                console.log('companion:', formData.get('companion'));
                console.log('companionName:', formData.get('companionName'));
                console.log('allergies:', formData.get('allergies'));
                console.log('message:', formData.get('message'));
                console.log('photoComment (getElementById):', document.getElementById('photoComment')?.value);
                console.log('==========================');
                
                console.log('選択されたファイル数:', selectedFiles.length);
                
                // ファイルをBase64に変換
                const filesData = await Promise.all(
                    selectedFiles.map(file => convertFileToBase64(file))
                );
                
                console.log('変換されたファイルデータ:', filesData);
                console.log('files配列の要素数:', filesData.length);
                
                // 送信データの構築
                const data = {
                    name: formData.get('guestName'),
                    email: formData.get('guestEmail'),
                    attendance: formData.get('attendance'),
                    companion: formData.get('companion'),
                    companionName: formData.get('companionName') || '',
                    allergies: formData.get('allergies') || '',
                    message: formData.get('message') || '',
                    photoComment: document.getElementById('photoComment').value || '',
                    files: filesData
                };
                
                console.log('=== 送信データ全体 ===');
                console.log('送信先URL:', gasUrl);
                console.log('name:', data.name);
                console.log('email:', data.email);
                console.log('attendance:', data.attendance);
                console.log('companion:', data.companion);
                console.log('companionName:', data.companionName);
                console.log('allergies:', data.allergies);
                console.log('message:', data.message);
                console.log('photoComment:', data.photoComment);
                console.log('files配列:', data.files);
                if (data.files.length > 0) {
                    console.log('最初のファイル情報:');
                    console.log('  - fileName:', data.files[0].fileName);
                    console.log('  - fileType:', data.files[0].fileType);
                    console.log('  - fileData length:', data.files[0].fileData.length, '文字');
                    console.log('  - fileData (最初の100文字):', data.files[0].fileData.substring(0, 100));
                }
                console.log('JSONサイズ:', JSON.stringify(data).length, 'bytes');
                console.log('======================');
                
                // GASへ送信
                const response = await fetch(gasUrl, {
                    method: 'POST',
                    mode: 'no-cors', // GASの場合はno-corsを使用
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                // no-corsの場合、レスポンスを直接読めないため、送信が完了したとみなす
                console.log('送信完了');
                
                // 成功メッセージを表示
                alert('ご回答ありがとうございました！');
                showSuccessMessage();
                
                // フォームをリセット
                resetForm();
                
            } catch (error) {
                console.error('送信エラー:', error);
                alert('送信中にエラーが発生しました。もう一度お試しください。');
            } finally {
                // ボタンを元に戻す
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
    
    // ファイルをBase64に変換する関数
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            console.log(`ファイル変換開始: ${file.name} (${file.type}, ${file.size} bytes)`);
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    const result = e.target.result;
                    console.log(`読み込み完了: ${file.name}`);
                    console.log(`  - result type: ${typeof result}`);
                    console.log(`  - result length: ${result.length}`);
                    console.log(`  - result prefix: ${result.substring(0, 50)}`);
                    
                    // "data:image/png;base64," などを除去して純粋なBase64データのみを抽出
                    const base64String = result.split(',')[1];
                    
                    console.log(`  - Base64 length: ${base64String.length}`);
                    console.log(`  - Base64 prefix: ${base64String.substring(0, 50)}`);
                    
                    const fileData = {
                        fileData: base64String,
                        fileName: file.name,
                        fileType: file.type
                    };
                    
                    console.log(`変換成功: ${file.name}`);
                    resolve(fileData);
                } catch (error) {
                    console.error(`変換エラー: ${file.name}`, error);
                    reject(error);
                }
            };
            
            reader.onerror = function(error) {
                console.error(`読み込みエラー: ${file.name}`, error);
                reject(error);
            };
            
            reader.readAsDataURL(file);
        });
    }
    
    // フォームをリセットする関数
    function resetForm() {
        if (rsvpForm) {
            rsvpForm.reset();
        }
        
        // 写真をクリア
        selectedFiles = [];
        photoPreviewContainer.innerHTML = '';
        if (photoCommentGroup) {
            photoCommentGroup.style.display = 'none';
        }
        document.getElementById('photoComment').value = '';
        
        // 同伴者名前欄を非表示
        const companionNameGroup = document.getElementById('companionNameGroup');
        if (companionNameGroup) {
            companionNameGroup.style.display = 'none';
        }
    }
    
    // 成功メッセージを表示
    function showSuccessMessage() {
        if (successOverlay) {
            successOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // スクロール防止
        }
    }
    
    // 成功メッセージを閉じる
    if (closeSuccessButton && successOverlay) {
        closeSuccessButton.addEventListener('click', function() {
            successOverlay.style.display = 'none';
            document.body.style.overflow = ''; // スクロール復元
            
            // ページトップへスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ヒーローセクションのアニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.style.opacity = '0';
            heroContent.style.transform = 'translateY(30px)';
            heroContent.style.transition = 'opacity 1s ease, transform 1s ease';
            
            setTimeout(() => {
                heroContent.style.opacity = '1';
                heroContent.style.transform = 'translateY(0)';
            }, 100);
        }, 100);
    }
});

// スムーススクロール（アンカーリンクがある場合）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
