const BtnStart = ({isSpinning, stats, StartAnim}) => {
    const btnState = () =>{
        if (isSpinning){
            return true;
        }
        if(stats.todayAttempts>=5){
            return true;
        }
        return false;
    }

    const btnText= () =>{
        if(isSpinning) {
            return 'Крутится...'
        }
        if(stats.todayAttempts>=5){
            return 'Лимит исчерпан :('
        }
        return `Испытай удачу (Осталось: ${5-stats.todayAttempts})`;
    }

    return (
        <div className="btn-spin">
            <button className="btn-start"
                    disabled={btnState()}
                    onClick={() => { StartAnim();
                     }}>
                    {btnText()}
            </button>
        </div>
    )
}

export default BtnStart;