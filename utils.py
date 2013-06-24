def getSiteFromRequest(request):
    
    url = request.META['HTTP_HOST']
        
    site = "openmir"

    if ("orchive" in url):
        site = "orchive"

    if ("ornithopedia" in url):
        site = "ornithopedia"

    return site
