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
                if (file.type.startsWith('image/')) {
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
    
    // 写真プレビューを追加
    function addPhotoPreview(file) {
        const reader = new FileReader();
        const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'photo-preview-item';
            previewItem.dataset.fileId = fileId;
            
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <p class="photo-preview-filename">${file.name}</p>
                <button class="photo-delete-button" data-file-id="${fileId}">×</button>
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
    
    // フォーム送信処理
    const submitButton = document.getElementById('submitButton');
    const rsvpForm = document.getElementById('rsvpForm');
    const successOverlay = document.getElementById('successOverlay');
    const closeSuccessButton = document.getElementById('closeSuccessButton');
    
    if (submitButton && rsvpForm) {
        submitButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            // フォームバリデーション
            if (!rsvpForm.checkValidity()) {
                rsvpForm.reportValidity();
                return;
            }
            
            // フォームデータを取得
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('guestName'),
                email: formData.get('guestEmail'),
                attendance: formData.get('attendance'),
                companion: formData.get('companion'),
                companionName: formData.get('companionName'),
                allergies: formData.get('allergies'),
                message: formData.get('message'),
                photoComment: document.getElementById('photoComment').value,
                photos: selectedFiles.map(file => file.name)
            };
            
            console.log('送信データ:', data);
            console.log('選択された写真:', selectedFiles);
            
            // ここで実際の送信処理を実装
            // 例: fetch API でサーバーに送信、またはGoogle Driveにアップロード等
            
            // 送信完了メッセージを表示
            showSuccessMessage();
        });
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
            
            // フォームをリセット
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
            if (companionNameGroup) {
                companionNameGroup.style.display = 'none';
            }
            
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
