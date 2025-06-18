
function ScrollToTopBtn() {
    return (
        <div className="fixed bottom-10 right-10 p-5 border-2 rounded-full cursor-pointer w-15 h-15 sm:block active:bg-gray-200 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
            onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}>
            <img src="/img/uparrow.png" alt="up-arrow" className="w-full h-full" />
        </div>
    )
}

export default ScrollToTopBtn