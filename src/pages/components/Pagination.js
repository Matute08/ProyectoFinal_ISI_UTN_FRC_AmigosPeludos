import React, {useState, useEffect} from "react";

const Pagination = ({
    cardsPerPage,
    currentPage,
    setCurrentPage,
    totalCards,
}) => {
    const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
    const pageNumbers = [];
    console.log();

    for (let i = 1; i <= Math.ceil(totalCards / cardsPerPage); i++) {
        pageNumbers.push(i);
    }
    useEffect(() => {
        if (shouldScrollToTop) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setShouldScrollToTop(false);
        }
      }, [shouldScrollToTop]);

    const onPreviusPage = () => {
        setCurrentPage(currentPage - 1);
        setShouldScrollToTop(true)
    };

    const onNextPage = () => {
        setCurrentPage(currentPage + 1);
        setShouldScrollToTop(true)
    };
    const onSpecificPage = (n) => {
        setCurrentPage(n);
    };
    return (
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-center">
                <li class="page-item">
                    <button class={`page-link ${currentPage === 1 ? "disabled" : ""} `} onClick={onPreviusPage}>
                        Anterior
                    </button>
                </li>

                {pageNumbers.map((noPage) => (
                    <li class="page-item" key={noPage}>
                        <a
                            class={`page-link ${
                                noPage === currentPage ? "active" : ""
                            }`}
                            onClick={()=> onSpecificPage(noPage)}                            
                        >
                            {noPage}
                            
                        </a>
                    </li>
                ))}

                <li class="page-item">
                    <button class={`page-link ${currentPage >= pageNumbers.length ? "disabled" : ""}`} href="#" onClick={onNextPage}>
                        Siguiente
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
