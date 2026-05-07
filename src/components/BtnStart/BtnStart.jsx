const BtnStart = ({isSpinning, StartAnim}) => {
    const btnState = () =>{
        if (isSpinning){
            return true;
        }
        
        return false;
    }

    const btnText= () =>{
        if(isSpinning) {
            return 'Крутится...'
        }
        
        return `Испытай удачу`;
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