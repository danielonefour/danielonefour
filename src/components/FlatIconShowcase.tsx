import React from 'react';
import FlatIcon from './icons/FlatIconDemo';

const FlatIconShowcase: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-primary">Flaticon UI Icons</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-primary-700">Regular Icons</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <FlatIcon icon="home" size="xl" className="text-primary" />
            <span className="text-sm mt-1">home</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="user" size="xl" className="text-primary" />
            <span className="text-sm mt-1">user</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="settings" size="xl" className="text-primary" />
            <span className="text-sm mt-1">settings</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="bell" size="xl" className="text-primary" />
            <span className="text-sm mt-1">bell</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="search" size="xl" className="text-primary" />
            <span className="text-sm mt-1">search</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-alt-700">Solid Icons</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <FlatIcon icon="home-s" size="xl" className="text-alt" />
            <span className="text-sm mt-1">home-s</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="user-s" size="xl" className="text-alt" />
            <span className="text-sm mt-1">user-s</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="settings-s" size="xl" className="text-alt" />
            <span className="text-sm mt-1">settings-s</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="bell-s" size="xl" className="text-alt" />
            <span className="text-sm mt-1">bell-s</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="search-s" size="xl" className="text-alt" />
            <span className="text-sm mt-1">search-s</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Brand Icons</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col items-center">
            <FlatIcon icon="github-brand" size="xl" className="text-gray-700" />
            <span className="text-sm mt-1">github</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="twitter-brand" size="xl" className="text-gray-700" />
            <span className="text-sm mt-1">twitter</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="facebook-brand" size="xl" className="text-gray-700" />
            <span className="text-sm mt-1">facebook</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="instagram-brand" size="xl" className="text-gray-700" />
            <span className="text-sm mt-1">instagram</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="linkedin-brand" size="xl" className="text-gray-700" />
            <span className="text-sm mt-1">linkedin</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-primary-700">Different Sizes</h3>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="sm" className="text-alt" />
            <span className="text-sm mt-1">sm</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="md" className="text-alt" />
            <span className="text-sm mt-1">md</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="lg" className="text-alt" />
            <span className="text-sm mt-1">lg</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="xl" className="text-alt" />
            <span className="text-sm mt-1">xl</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="2xl" className="text-alt" />
            <span className="text-sm mt-1">2xl</span>
          </div>
          <div className="flex flex-col items-center">
            <FlatIcon icon="star" size="3xl" className="text-alt" />
            <span className="text-sm mt-1">3xl</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlatIconShowcase; 