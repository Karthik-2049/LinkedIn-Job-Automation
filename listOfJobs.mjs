


export async function listOfJobs(page)
{
    const jList = await page.evaluate(()=>
    {
        const searchResults = document.querySelector('.jobs-search-results-list')
        const ul_elem = searchResults.querySelector('ul')
        const li_elem = ul_elem.querySelectorAll('li')
        let result = Array.from(li_elem).map(li => `#${li.getAttribute('id')}`)
        return result;
    })

    let finalList = []
    for(let x = 1;x<jList.length;x++)
    {
        if(jList[x]!=='#null')
        {
            finalList.push(jList[x])
        }
    }

    return finalList
}