(function () {
    "use strict";

    function initListSubcategoryTabs() {
        var root = document.getElementById("ttListCategoryTabs");
        if (!root) return;

        var subShell = document.getElementById("ttListSubcategoryShell");
        var subTabsRoot = document.getElementById("ttListSubcategoryTabs");
        var subTitle = document.getElementById("ttListSubcategoryTitle");

        var path = (window.location && window.location.pathname ? window.location.pathname : "").toLowerCase();
        var tabs = root.querySelectorAll(".list-category-tab");
        var activeSlug = "";
        var activeSubSlug = "";

        var aliasRootMap = {
            enginnering: "engineering",
            trubleshooting: "troubleshooting"
        };

        var subcategoryMap = {
            computerscience: {
                label: "ComputerScience",
                items: [
                    { slug: "datastructure", label: "DataStructure" },
                    { slug: "algorithm", label: "Algorithm" },
                    { slug: "network", label: "Network" },
                    { slug: "os", label: "OS" }
                ]
            },
            development: {
                label: "Development",
                items: [
                    { slug: "language", label: "Language" },
                    { slug: "framework", label: "Framework" },
                    { slug: "infra", label: "Infra" },
                    { slug: "database", label: "DataBase" },
                    { slug: "tool", label: "Tool" }
                ]
            },
            engineering: {
                label: "Engineering",
                items: [
                    { slug: "designpattern", label: "DesignPattern" },
                    { slug: "test", label: "Test" }
                ]
            },
            troubleshooting: {
                label: "TroubleShooting",
                items: [
                    { slug: "retrospective", label: "Retrospective" },
                    { slug: "performance", label: "Performance" }
                ]
            }
        };

        if (path.indexOf("/category/") !== -1) {
            var rest = path.split("/category/")[1] || "";
            var parts = rest.split("/").filter(function (v) { return !!v; });
            var slug = parts[0] || "";
            activeSlug = aliasRootMap[slug] || slug;
            activeSubSlug = parts[1] || "";
        }

        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var slugAttr = tab.getAttribute("data-category-slug") || "";
            var isActive = slugAttr === activeSlug || (!activeSlug && slugAttr === "" && path.indexOf("/category/") === -1);
            if (path.indexOf("/category") !== -1 && slugAttr === "" && !activeSlug) {
                isActive = true;
            }
            tab.classList.toggle("is-active", isActive);
            if (isActive) tab.setAttribute("aria-current", "page");
            else tab.removeAttribute("aria-current");
        }

        if (!subShell || !subTabsRoot || !subcategoryMap[activeSlug]) return;

        var subData = subcategoryMap[activeSlug];
        var categoryBase = "[##_blog_link_##]category/";
        if (categoryBase.indexOf("[##_") !== -1) {
            categoryBase = (window.location && window.location.origin ? window.location.origin : "") + "/category/";
        }

        if (subTitle) subTitle.textContent = subData.label;
        subTabsRoot.innerHTML = "";

        var allSub = document.createElement("a");
        allSub.className = "list-subcategory-tab";
        allSub.href = categoryBase + activeSlug;
        allSub.textContent = "전체";
        allSub.setAttribute("data-subcategory-slug", "");
        if (!activeSubSlug) {
            allSub.classList.add("is-active");
            allSub.setAttribute("aria-current", "page");
        }
        subTabsRoot.appendChild(allSub);

        for (var j = 0; j < subData.items.length; j++) {
            var item = subData.items[j];
            var a = document.createElement("a");
            a.className = "list-subcategory-tab";
            a.href = categoryBase + activeSlug + "/" + item.slug;
            a.textContent = item.label;
            a.setAttribute("data-subcategory-slug", item.slug);
            if (activeSubSlug === item.slug) {
                a.classList.add("is-active");
                a.setAttribute("aria-current", "page");
            }
            subTabsRoot.appendChild(a);
        }

        subShell.hidden = false;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initListSubcategoryTabs, { once: true });
    } else {
        initListSubcategoryTabs();
    }
})();
