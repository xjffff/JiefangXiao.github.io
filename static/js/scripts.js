const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'projects']


// ── Theme toggle ──
;(function () {
    const saved = localStorage.getItem('theme') || 'dark'
    applyTheme(saved)

    window.addEventListener('DOMContentLoaded', () => {
        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme')
            const next = current === 'dark' ? 'light' : 'dark'
            applyTheme(next)
            localStorage.setItem('theme', next)
        })
    })

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme)
        document.documentElement.style.colorScheme = theme
        const icon = document.getElementById('theme-icon')
        if (icon) icon.className = theme === 'dark' ? 'bi bi-moon-fill' : 'bi bi-sun-fill'
    }
})()


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


    // Yaml
    fetch(content_dir + config_file)
        .then(response => response.text())
        .then(text => {
            const yml = jsyaml.load(text);
            Object.keys(yml).forEach(key => {
                try {
                    document.getElementById(key).innerHTML = yml[key];
                } catch {
                    console.log("Unknown id and value: " + key + "," + yml[key].toString())
                }
            })
        })
        .catch(error => console.log(error));


    // Marked
    marked.use({ mangle: false, headerIds: false })
    section_names.forEach((name, idx) => {
        fetch(content_dir + name + '.md')
            .then(response => response.text())
            .then(markdown => {
                const html = marked.parse(markdown);
                document.getElementById(name + '-md').innerHTML = html;
            }).then(() => {
                MathJax.typeset();
            })
            .catch(error => console.log(error));
    })

});
