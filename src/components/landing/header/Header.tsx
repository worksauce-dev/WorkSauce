export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 bg-opacity-80 shadow-sm fixed w-full z-10 backdrop-blur">
      <nav className="mx-auto px-6 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary-accent dark:text-white">
          WorkSauce
        </div>
        <div className="hidden md:flex space-x-4">
          <a
            href="product"
            className="text-gray-600 dark:text-gray-300 hover:text-primary-accent dark:hover:text-blue-400 px-3 py-2 transition duration-300"
          >
            제품
          </a>
          <a
            href="partners"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition duration-300"
          >
            파트너십
          </a>
          <a
            href="doc"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition duration-300"
          >
            도움말
          </a>
          <a
            href="login"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 transition duration-300"
          >
            로그인 / 회원가입
          </a>
        </div>
        <button className="md:hidden text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          <i className="fas fa-bars"></i>
        </button>
      </nav>
    </header>
  );
};
