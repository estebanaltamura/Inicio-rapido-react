// ** Firestore Imports **
import { collection, getDocs } from 'firebase/firestore';

// ** Db Import
import { db } from 'firebaseConfig';

// ** Type Imports **
import { EntityTypesMapReturnedValues } from 'types';

export const dynamicGet = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
): Promise<T | undefined> => {
  const productsCollection = collection(db, entity);

  try {
    const itemRes = await getDocs(productsCollection);

    const itemList = itemRes.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    return itemList as unknown as T;
  } catch (error) {
    console.log(error);
  }
};
