const body = document.querySelector("body");
const e = document.createElement("div");
e.style = "height: 1.5cm; padding: 0 2ch; position: sticky; top: 0; z-index: 1000; justify-content: space-between; align-items: center; gap: 15px;";
e.id = "nav";
e.classList.add("bg-darkSteel", "fc-white", "fs-300", "flex");
e.innerHTML = `
    <a href="/">Anthony Segedi's <span style="color: hsl(var(--clr-steel));">Portfolio</span></a>
    <div class="flex fs-100" style="height: 100%; gap: 20px; align-items: center;">
        <a href="/#contact-form">Contact</a>
        <span style="margin: 0 -10px;">|</span>
        <a href="/res/resume.pdf" target="_blank">Resume</a>
        <a href="https://github.com/segedi-UW" target="_blank">
        <img height="30" src="/res/images/GitHub-Logo/GitHub-Mark-Light-64px.png" alt="UW-GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/anthony-segedi-5a6036142?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BG%2BVOcVjZQACDvpCOtbCfQA%3D%3D"
        target="_blank">
        <img height="30" src="/res/images/LinkedIn-Logos/LI-In-Bug.png" alt="LinkedIn"/>
        </a>
    </div>
`;
body.insertBefore(e, body.firstChild);