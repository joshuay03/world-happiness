export default function Navbar() {
    return (
        <div class="grid place-items-center mx-12">
        <div class="grid grid-cols-3 w-full mt-5 bg-gray-200 rounded-lg">
            <ul class="inline-flex space-x-4 list-none py-2 pl-10">
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Rankings</a></li>
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Search</a></li>
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Factors</a></li>
            </ul>
            <div class="w-full h-full"></div>
            <ul class="inline-flex space-x-4 list-none pt-2 pb-2 justify-end pr-10">
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Register</a></li>
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Login</a></li>
                <li class="hover:bg-gray-300 rounded-lg px-3 py-1"><a href="#">Logout</a></li>
            </ul>
        </div>
        </div>
    );
}