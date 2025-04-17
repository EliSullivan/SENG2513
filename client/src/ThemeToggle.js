import react, {useState, useEffect} from 'react';

const ThemeSwitcher= () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme= localStorage.getItem('theme');
        return savedTheme || 'dark'; //can set default theme here
    });
//applies theme class to body
useEffect(()=>{
    document.body.className= theme;
    localStorage.setItem('theme', theme);
}, [theme]);

const toggleTheme= () => {
    setTheme(theme=== 'dark'? 'light': 'dark');
};
return(
    <button
        onClick={toggleTheme}
        classname='theme-toggle-btn'
    >
        {theme==='dark'? 'Light':'Dark'}
    </button>
);
};
 




export default ThemeSwitcher;