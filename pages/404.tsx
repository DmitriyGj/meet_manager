import style from  './index.module.scss';

const notFoundPage = () => {
    return (
        <div className={style.container}>
            <h2>Not found</h2>
        </div>
    )
}

export default notFoundPage;