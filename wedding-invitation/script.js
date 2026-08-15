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
