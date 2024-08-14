export const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">회사 소개</h3>
            <p className="text-gray-400">혁신적인 솔루션을 제공하는 리더</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">링크</h3>
            <ul className="text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  홈
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  서비스
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  가격
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  연락처
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">연락처</h3>
            <p className="text-gray-400">
              이메일: info@company.com
              <br />
              전화: 02-1234-5678
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 회사명. 모든 권리 보유.</p>
        </div>
      </div>
    </footer>
  );
};
