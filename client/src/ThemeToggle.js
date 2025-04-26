import react, {useState, useEffect} from 'react';
import './ThemeColor.css';


const themes= [
    {id:'default', name:'Default', color:'#3498db'},
    {id:'dark', name:'Dark', color:'black'},
    {id:'lemon', name:'Lemon', color:'yellow'},
    {id:'bloodorange', name:'BloodOrange', color:'linear-gradient(orange, red)'},
    {id:'rose', name:'Rose', color:'#CC8899'},
    {id:'velvetred', name:'VelvetRed', color:'maroon'},
    {id:'purplerain', name:'Purple Rain', color:'indigo'},
    {id:'midnightblue', name:'Midnight Blue', color:'#040457'},
    {id:'greenleaf', name:'Green Leaf', color:'darkgreen'},
    {id:'light', name:'Light', color:'white'}
];

function ThemeToggle() {
    const [currentTheme, setCurrentTheme]= useState(() => {
        const savedTheme= localStorage.getItem('selectedTheme');
        return savedTheme || 'default';
    });

//applies theme class to body
useEffect(()=>{
    document.body.className= '';
    document.body.classList.add(`theme-${currentTheme}`);
    localStorage.setItem('selectedTheme', currentTheme);
}, [currentTheme]);

const handleThemeChange= (themeId) => {
    setCurrentTheme(themeId);
};
return(
    <div className="theme-toggle">
        <h3>Choose a Theme</h3>
        <div className="theme-buttons">
            {themes.map((theme) => (
                <button
                    key={theme.id}
                    onClick={()=> handleThemeChange(theme.id)}
                    className={`theme-button ${currentTheme=== theme.id ? 'active' : ''}`}
                    style={{backgroundColor: theme.color}}
                    aria-label={`Switch to ${theme.name}theme`}
                    title={theme.name}
                >
                    <span className="theme-name">{theme.name}</span>
                </button>
            ))}
            </div>
            <p className="current-theme">Current theme: {themes.find(t => t.id=== currentTheme)?.name}</p>
        </div>
    );
}




export default ThemeToggle;