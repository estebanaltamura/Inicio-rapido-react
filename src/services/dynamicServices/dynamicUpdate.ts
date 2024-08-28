import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from 'firebaseConfig';
import { EntityTypesMapPayloadValues, EntityTypesMapReturnedValues } from 'types';

export const dynamicUpdate = async <T extends keyof EntityTypesMapReturnedValues>(
  entity: T,
  id: string,
  item: EntityTypesMapPayloadValues[T],
): Promise<EntityTypesMapReturnedValues[T] | undefined> => {
  const itemDocRef = doc(db, entity, id);

  try {
    const itemRes = await getDoc(itemDocRef);

    if (!itemRes.exists()) {
      throw new Error('Product does not exist');
    }

    const payload: EntityTypesMapReturnedValues[T] = {
      ...item,
      updatedAt: new Date(),
    } as EntityTypesMapReturnedValues[T];
    await setDoc(itemDocRef, payload);
    return payload;
  } catch (error) {
    console.log(error);
  }
};
