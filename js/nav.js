const body = document.querySelector("body");
const e = document.createElement("div");
e.style = "height: 1.5cm; padding: 0 2ch; position: sticky; top: 0; z-index: 1000; justify-content: space-between; align-items: center;";
e.id = "nav";
e.classList.add("bg-darkSteel");
e.classList.add("fc-white");
e.classList.add("fs-300");
e.classList.add("flex");
e.innerHTML = `
    <a href="https://www.ajseg.com">Anthony Segedi's <span style="color: hsl(var(--clr-steel));">Portfolio</span></a>
    <div class="flex fs-100" style="height: 100%; gap: 20px; align-items: center;">
        <a href="https://github.com/segedi-UW">
        <img height="30" src="/res/images/GitHub-Logo/GitHub-Mark-Light-64px.png" alt="UW-GitHub"/>
        </a>
        <a href="https://www.linkedin.com/in/anthony-segedi-5a6036142?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BG%2BVOcVjZQACDvpCOtbCfQA%3D%3D">
        <img height="30" src="/res/images/LinkedIn-Logos/LI-In-Bug.png" alt="LinkedIn"/>
        </a>
    </div>
`;
body.insertBefore(e, body.firstChild);