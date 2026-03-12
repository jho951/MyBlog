(function () {
    "use strict";

    function initListSubcategoryTabs() {
        var root = document.getElementById("ttListCategoryTabs");
        if (!root) return;

        var path = (window.location && window.location.pathname ? window.location.pathname : "").toLowerCase();
        var tabs = root.querySelectorAll(".list-category-tab");
        if (!tabs.length) return;

        var activeSlug = "";
        var activeSubSlug = "";

        var aliasRootMap = {
            enginnering: "engineering",
            trubleshooting: "troubleshooting"
        };

        var subcategoryMap = {
            computerscience: {
                items: [
                    { slug: "datastructure", label: "DataStructure" },
                    { slug: "algorithm", label: "Algorithm" },
                    { slug: "network", label: "Network" },
                    { slug: "os", label: "OS" }
                ]
            },
            development: {
                items: [
                    { slug: "language", label: "Language" },
                    { slug: "framework", label: "Framework" },
                    { slug: "infra", label: "Infra" },
                    { slug: "database", label: "DataBase" },
                    { slug: "tool", label: "Tool" }
                ]
            },
            engineering: {
                items: [
                    { slug: "designpattern", label: "DesignPattern" },
                    { slug: "test", label: "Test" }
                ]
            },
            troubleshooting: {
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

        var categoryBase = "[##_blog_link_##]category/";
        if (categoryBase.indexOf("[##_") !== -1) {
            categoryBase = (window.location && window.location.origin ? window.location.origin : "") + "/category/";
        }

        function createSubcategoryList(rootSlug) {
            var subData = subcategoryMap[rootSlug];
            if (!subData || !subData.items || !subData.items.length) return null;
            var activeOnly = activeSlug === rootSlug && !!activeSubSlug;

            var subNav = document.createElement("div");
            subNav.className = "list-subcategory-list";
            subNav.id = "ttListSubcategory-" + rootSlug;

            if (!activeOnly) {
                var allSub = document.createElement("a");
                allSub.className = "list-subcategory-tab";
                allSub.href = categoryBase + rootSlug;
                allSub.textContent = "전체";
                allSub.setAttribute("data-subcategory-slug", "");
                if (activeSlug === rootSlug && !activeSubSlug) {
                    allSub.classList.add("is-active");
                    allSub.setAttribute("aria-current", "page");
                }
                subNav.appendChild(allSub);
            }

            for (var i = 0; i < subData.items.length; i++) {
                var item = subData.items[i];
                if (activeOnly && item.slug !== activeSubSlug) continue;
                var a = document.createElement("a");
                a.className = "list-subcategory-tab";
                a.href = categoryBase + rootSlug + "/" + item.slug;
                a.textContent = item.label;
                a.setAttribute("data-subcategory-slug", item.slug);
                if (activeSlug === rootSlug && activeSubSlug === item.slug) {
                    a.classList.add("is-active");
                    a.setAttribute("aria-current", "page");
                }
                subNav.appendChild(a);
            }

            return subNav;
        }

        function setExpanded(node, expand) {
            if (!node) return;
            var btn = node.querySelector(".list-category-expand");
            if (!btn) return;
            btn.setAttribute("aria-expanded", expand ? "true" : "false");
            node.classList.toggle("is-expanded", !!expand);
        }

        var nodes = [];
        var expandedNode = null;

        for (var t = 0; t < tabs.length; t++) {
            var tab = tabs[t];
            var slugAttr = tab.getAttribute("data-category-slug") || "";
            var isCategoryPage = path.indexOf("/category") !== -1;
            var isActive = slugAttr === activeSlug || (!activeSlug && slugAttr === "" && !isCategoryPage);
            if (isCategoryPage && slugAttr === "" && !activeSlug) isActive = true;

            var node = document.createElement("div");
            node.className = "list-category-node";
            if (isActive) {
                node.classList.add("is-active");
                tab.classList.add("is-active");
                tab.setAttribute("aria-current", "page");
            } else {
                tab.classList.remove("is-active");
                tab.removeAttribute("aria-current");
            }

            var subPanel = createSubcategoryList(slugAttr);
            if (subPanel) {
                node.classList.add("has-children");

                var row = document.createElement("div");
                row.className = "list-category-row";

                var expandBtn = document.createElement("button");
                expandBtn.type = "button";
                expandBtn.className = "list-category-expand";
                expandBtn.setAttribute("aria-expanded", "false");
                expandBtn.setAttribute("aria-controls", subPanel.id);
                expandBtn.setAttribute("aria-label", tab.textContent + " 하위 카테고리 펼치기");
                expandBtn.innerHTML = '<span class="expand-icon" aria-hidden="true"></span>';

                row.appendChild(tab);
                row.appendChild(expandBtn);
                node.appendChild(row);
                node.appendChild(subPanel);

                if (isActive) {
                    expandedNode = node;
                }

                (function (targetNode) {
                    expandBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        var isOpen = targetNode.classList.contains("is-expanded");
                        if (expandedNode && expandedNode !== targetNode) {
                            setExpanded(expandedNode, false);
                        }
                        setExpanded(targetNode, !isOpen);
                        expandedNode = targetNode.classList.contains("is-expanded") ? targetNode : null;
                    });
                })(node);
            } else {
                node.appendChild(tab);
            }

            nodes.push(node);
        }

        root.innerHTML = "";
        for (var n = 0; n < nodes.length; n++) {
            root.appendChild(nodes[n]);
        }

        if (expandedNode) {
            setExpanded(expandedNode, true);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initListSubcategoryTabs, { once: true });
    } else {
        initListSubcategoryTabs();
    }
})();
