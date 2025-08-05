export default function CatButton(name) {
    return (
        <button className="flex-row gap-0 items-center cursor-pointer hidden lg:flex">
        <h2 class="font-heading text-text-menu-active text-2xl" name={name}>{ name.name }</h2>
        <img src="images/chevronDown.svg"></img>
    </button>
    )
}