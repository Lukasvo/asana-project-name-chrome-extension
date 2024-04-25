(() => {
    const findColorClass = (strings: string[]) => {
        const colorPattern = /--color\w+/;
        const result = strings.find(string => colorPattern.test(string));
        return result ? result.match(colorPattern)?.[0] : null;
    }

    const findLabelContent = (element: HTMLDivElement) => {
        // Step 1: Traverse upwards to find the nearest parent with the specified class
        const parent = element.closest('.SidebarNavigationLinkCard');
        if (!parent) {
            console.error('No parent with the class SidebarNavigationLinkCard found');
            return null;
        }

        // Step 2: Search downwards from the found parent to get the child with the specified class
        const labelElement = parent.querySelector('.SidebarNavigationLinkCard-label');
        if (!labelElement) {
            console.error('No child with the class SidebarNavigationLinkCard-label found');
            return null;
        }

        // Step 3: Return the text content of the found label element
        return labelElement.textContent;
    }

    const insertLabelsInStripes = (pills: NodeListOf<HTMLDivElement>) => {
        pills.forEach(stripeElement => {
            const projectNavItem = document.querySelector<HTMLDivElement>('.SidebarNavigationLinkCard-icon .ColorFillIcon' + findColorClass([...stripeElement.classList]));
            if (!projectNavItem) return;

            const label = findLabelContent(projectNavItem);
            if (!label) return;

            stripeElement.innerText = label;
            stripeElement.style.padding = '6px';
            stripeElement.style.width = 'auto';
            stripeElement.style.height = 'auto';
        });
    }

    const observer = new MutationObserver((mutations, mutationInstance) => {
        const pills = document.querySelectorAll<HTMLDivElement>('.BoardCardPotPills-potPill');
        if (pills.length) {
            insertLabelsInStripes(pills);
            mutationInstance.disconnect();
        }
    });

    const observerOptions = {
        childList: true,
        subtree: true
    };
    observer.observe(document.body, observerOptions);

    let lastUrl = location.href;
    setInterval(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            console.log('URL changed from', lastUrl, 'to', currentUrl);
            lastUrl = currentUrl;
            observer.observe(document.body, observerOptions);
        }
    }, 1000); // Check every second 
})();