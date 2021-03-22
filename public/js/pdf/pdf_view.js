const url = '/download/Menu.pdf'
const downloadButton = document.getElementById("pdf-download-button")
const pdfjsLib = window['pdfjs-dist/build/pdf']
const worker = window['pdfjs-dist/build/pdf.worker']
pdfjsLib.GlobalWorkerOptions.workerSrc = worker

const LoadPDF = () => {
    const loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        console.log('PDF loaded');

        // Fetch the first page
        var pageNumber = 1;
        pdf.getPage(pageNumber).then(function(page) {
            console.log('Page loaded');

            var scale = 1.5;
            var viewport = page.getViewport({ scale: scale });

            // Prepare canvas using PDF page dimensions
            var canvas = document.getElementById('the-canvas');
            var context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: context,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function() {
                console.log('Page rendered');
                downloadButton.removeAttribute('disabled')
                canvas.style.display = 'block'
            });
        });
    }, function(reason) {
        // PDF loading error
        console.error(reason);
    });
}

const generatePDF = async() => {
    const btn = document.getElementById("generate-PDF")
    btn.setAttribute("disabled", "disabled")

    try {
        StartLoading(btn)
        const req = await fetch(`${baseURL}menu/generate`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.getItem("authToken")
            }
        })
        StopLoading(btn)
        if (req.status === 200) {
            alert("Menu generated correctly!")
            downloadButton.setAttribute('href', url)
            downloadButton.removeAttribute('disabled')
            LoadPDF()
        } else {
            downloadButton.setAttribute('disabled', 'disabled')
            alert("Server Error")
        }
    } catch (error) {
        StopLoading(btn)
        alert(error)
    }

}

LoadPDF()