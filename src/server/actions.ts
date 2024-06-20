'use server'

import { redirect } from "next/navigation";
import { getServerAuthSession } from "./auth";
import db from "./db";

export const claimUrl = async (url: string) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.user.update({
        where: {
            id: user.id,
        },
        data: {
            url: url,
        },
    })
    return result;
}

export const getProfileData = async(url?: string) => {
    if(!url) {
        const session = await getServerAuthSession();
        const user = session?.user;
        if(!user) {
            return null
        }
        const result = await db.user.findUnique({
            where: {
                id: user.id
            },
            include: {
                Categories: {
                    select: {
                        id: true,
                        
                        name: true,
                        order: true,
                        links: {
                            select: {
                                id: true,
                                title: true,
                                url: true,
                                isPublished: true,
                                order: true,
                            },
                            orderBy: {
                                order: 'asc',
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc',
                    }
                },
                Socials: {
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        })
        return result;
    } else {
        const result = await db.user.findUnique({
            where: {
                url: url
            },
            include: {
                Categories: {
                    select: {
                        id: true,
                        
                        name: true,
                        order: true,
                        links: {
                            select: {
                                id: true,
                                title: true,
                                url: true,
                                isPublished: true,
                                order: true,
                            },
                            orderBy: {
                                order: 'asc',
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc',
                    }
                },
                Socials: {
                    select: {
                        id: true,
                        url: true,
                    }
                }
            }
        })
        return result;
    }
}


export const updateProfileData = async( data: {
    id: string,
    url: string,
    name: string,
    designation: string,
    image: string,
    description: string,
    backgroundImage?: string,
}) => {
        const session = await getServerAuthSession();
        const user = session?.user;
        if(!user) {
            redirect('/')
        }

        const isURLTaken = await db.user.findFirst({
            where: {
                url: data.url,
                id: {
                    not: user.id,
                }
            }
        })

        if(isURLTaken) {
            return {
                error: 'URL already taken'
            }
        }

        const result = await db.user.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                url: data.url,
                designation: data.designation,
                image: data.image,
                bio: data.description,
                backGroundImage: data.backgroundImage,
            },
        })  
        return result;
}

export const getCategories = async() => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        return null
    }
    const result = await db.category.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            order: 'asc',
        }
    })
    return result;
}

export const createCategory = async(data: {
    name: string,
}) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.category.create({
        data: {
            name: data.name,
            userId: user.id,
        }
    })
    return result;
}

export const updateCategory = async(data: {
    id: string,
    name: string,
}) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.category.update({
        where: {
            id: data.id,
        },
        data: {
            name: data.name,
        }
    })
    return result;
}

export const deleteCategory = async(id: string) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.category.delete({
        where: {
            id: id,
        }
    })
    return result;
}

export const createLink = async(data: {
    title: string,
    url: string,
    category: string,
}) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const category = await db.category.findUnique({
        where: {
            id: data.category,
        }
    })
    const result = await db.link.create({
        data: {
            title: data.title,
            url: data.url,
            userId: user.id,
            categoryId: category?.id,
        }
    })
    return result;
}   

export const updateLink = async(data: {
    id: string,
    title: string,
    url: string,
    category: string,
}) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const category = await db.category.findUnique({
        where: {
            id: data.category,
        }
    })
    const result = await db.link.update({
        where: {
            id: data.id,
        },
        data: {
            title: data.title,
            url: data.url,
            categoryId: category?.id,
        }
    })
    return result;
}

export const deleteLink = async(id: string) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.link.delete({
        where: {
            id: id,
        }
    })
    return result;
}

export const updatePublishLink = async(id: string, isPublished: boolean) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.link.update({
        where: {
            id: id,
        },
        data: {
            isPublished: isPublished,
        }
    })
    return result;
}

export const createSocials = async(data: {
    url: string,
}) => {
    if(data.url.split('@')[1] === 'gmail.com') {
        data.url = `mailto:${data.url}`
    }
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }

    const isOverLimit = await db.socials.count({
        where: {
            userId: user.id,
        }
    })

    if(isOverLimit >= 4) {
        return {
            error: 'Each user is allowed only 4 socials. Sorry I am poor :) it cost me money to store data.'
        }
    }
    const result = await db.socials.create({
        data: {
            url: data.url,
            userId: user.id,
        }
    })
    return result;
}

export const updateSocials = async(data: {
    id: string,
    url: string,
}) => {
    if(data.url.split('@')[1] === 'gmail.com') {
        data.url = `mailto:${data.url}`
    }
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.socials.update({
        where: {
            id: data.id,
        },
        data: {
            url: data.url,
        }
    })
    return result;
}

export const deleteSocials = async(id: string) => {
    const session = await getServerAuthSession();
    const user = session?.user;
    if(!user) {
        redirect('/')
    }
    const result = await db.socials.delete({
        where: {
            id: id,
        }
    })
    return result;
}